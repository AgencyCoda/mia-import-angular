import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MiaImportConfig } from '../../entities/mia-import-config';
import * as XLSX from 'xlsx';
import { MatSelectChange } from '@angular/material/select';
import { MiaImportColumn } from '../../entities/mia-import-column';

@Component({
  selector: 'lib-mia-import-modal',
  templateUrl: './mia-import-modal.component.html',
  styleUrls: ['./mia-import-modal.component.css']
})
export class MiaImportModalComponent implements OnInit {

  protected filesSubject!: Subject<File>;

  step = 1;

  hasHeader = false;
  headerNumberRow = 1;

  dataNumberRow = 1;
  dataNumberEndRow = -1; // Numero de fila que temrina la información
  dataNumberExistRow = -1; // Numero de columnas en el archivo
  dataNumberExistRowArr: Array<number> = [];
  dataExample: Array<any> = [];
  dataRaw: Array<any> = [];

  indexes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<MiaImportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public config: MiaImportConfig,
  ) { }

  ngOnInit(): void {
    this.configXlsx();
  }

  onImport() {
    let result = new Array<any>();

    for (let i = 0; i < this.dataRaw.length; i++) {
      if(i < this.dataNumberRow){
        continue;
      }
      const raw = this.dataRaw[i-1];
      
      let item: any = {};
      for (const column of this.config.columns) {
        if(column.columnIndex != undefined && column.columnIndex >= 0){
          if(column.type == MiaImportColumn.TYPE_DOUBLE){
            item[column.field_key] =  parseFloat(raw[column.columnIndex]);
          } else if(column.type == MiaImportColumn.TYPE_INT){
            item[column.field_key] =  parseInt(raw[column.columnIndex]);
          } else {
            item[column.field_key] = raw[column.columnIndex];
          }
          
        }

        if(column.columnOptionId != undefined){
          item[column.field_option!] = column.columnOptionId;
        }
      }

      result.push(item);
    }

    this.dialogRef.close(result);
  }

  resetColumnIndex(index: number) {
    this.config.columns.filter(c => c.columnIndex == index).forEach(c => {
      c.columnIndex = -1;
    });
  }

  onSelectColumn(select: MatSelectChange, index: number) {
    this.resetColumnIndex(index);
    let column: MiaImportColumn = select.value;
    if(column == undefined){
      return;
    }
    column.columnIndex = index;
  }

  onSelectOption(select: MatSelectChange, column: MiaImportColumn) {
    column.columnOptionId = select.value;
  }

  onProcessFiles(target: any) {
    if(!target.files || target.files.length <= 0){
      return;
    }

    this.filesSubject.next(target.files[0]);
  }

  generateFor() {
    for (let i = 0; i < this.dataNumberExistRow; i++) {
      this.dataNumberExistRowArr.push(i);
    }
  }

  processXlsx(data: any) {
    // Save data Raw
    this.dataRaw = data;
    // verify if Header
    if(this.hasHeader){
      this.dataNumberExistRow = data[this.headerNumberRow-1].length;
      this.dataExample.push(data[this.headerNumberRow-1]);
    } else {
      this.dataNumberExistRow = data[this.dataNumberRow].length;
    }

    for (let i = 0; i < 3; i++) {
      if(this.dataNumberRow + i >= data.length){
        continue;
      }

      this.dataExample.push(data[this.dataNumberRow + i - 1]);
    }

    this.generateFor();
    this.step = 2;
  }

  configXlsx() {
    this.filesSubject = new Subject();
    this.filesSubject.pipe(switchMap(file => {
      this.isLoading = true;
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

      this.processXlsx(data[0]);
      this.isLoading = false;

    });
  }

  getColumnsForUse(index: number): Array<MiaImportColumn> {
    return this.config.columns.filter(c => c.columnIndex == index || c.columnIndex == -1 || c.columnIndex == undefined);
  }
}
