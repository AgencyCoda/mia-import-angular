import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MiaImportConfig, MiaImportModalComponent } from 'projects/agencycoda/mia-import/src/public-api';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  protected filesSubject!: Subject<File>;
  isFileSelected = false;

  dataStartNumberRow = 7;
  dataExample: Array<any> = [];
  headerNumberRow = 6;
  headers = [];

  columns = [
    { field_key: 'title', label: 'Description', type: 'string' },
    { field_key: 'amount_debit', label: 'Amount Debit', type: 'double' },
    { field_key: 'amount_credit', label: 'Amount Credit', type: 'double' },
    { field_key: 'amount', label: 'Amount', type: 'double' },
    { field_key: 'date', label: 'Date', type: 'date' },
    { field_key: 'notes', label: 'Notes', type: 'string' },
  ];
  
  constructor(
    protected dialog: MatDialog
  ) {
    this.configXlsx();
  }

  onClickStart() {
    this.dialog.open(MiaImportModalComponent, {
      width: '520px',
      panelClass: 'modal-full-width-mobile',
      data: new MiaImportConfig()
    })
  }



  onGenerate() {
    let rows = new Array<any>();

    for (const header of this.headers) {
      
    }

    console.log(rows);
  }

  convertToDouble(item: any) {
    return parseFloat(item);
  }

  processXlsx(data: any) {
    this.headers = data[this.headerNumberRow-1];
    this.dataExample = [];

    for (let i = 0; i < 3; i++) {
      if(this.dataStartNumberRow + i >= data.length){
        continue;
      }

      this.dataExample.push(data[this.dataStartNumberRow + i]);
    }
  }

  onProcessFiles(target: any) {
    if(!target.files || target.files.length <= 0){
      return;
    }

    this.filesSubject.next(target.files[0]);
  }

  configXlsx() {
    this.filesSubject = new Subject();
    this.filesSubject.pipe(switchMap(file => {
      return new Observable<any>((observer) => {
        let reader: FileReader = new FileReader();
        reader.onload = (e) => {
          observer.next((e.target as any).result);
        };

        reader.readAsBinaryString(file);
        return () => {
          reader.abort();
        };
      })
    }), 
    map(value => {
      return XLSX.read(value, {type: 'binary'});
    }),
    map((wb: XLSX.WorkBook) => {
      return wb.SheetNames.map((sheetName: string) => {
        let sheet: XLSX.WorkSheet = wb.Sheets[sheetName];
        return (XLSX.utils.sheet_to_json(sheet, {header: 1}));
        //return sheet;
      });
    })).subscribe(data => {

      this.isFileSelected = true;
      this.processXlsx(data[0]);
      console.log('--EXCEL--');
      console.log(data);

    });
  }
}
