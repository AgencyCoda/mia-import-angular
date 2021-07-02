import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MiaImportConfig } from '../../entities/mia-import-config';
import * as XLSX from 'xlsx';
import { MatSelectChange } from '@angular/material/select';
import { MiaImportColumn, MiaImportDataColumn, MiaImportExtraField } from '../../entities/mia-import-column';
import * as moment from 'moment';
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
  dataExample: Array<any> = [];
  dataRaw: Array<any> = [];
  dataColumns: Array<MiaImportDataColumn> = []; // Almacena el objeto de cada columna que existe en el excel

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
      if(i < this.dataNumberRow || (this.dataNumberEndRow > 0 && i > this.dataNumberEndRow)){
        continue;
      }
      const raw = this.dataRaw[i-1];
      
      let item: any = {};
      for (const dataC of this.dataColumns) {
        if(dataC.column == undefined) {
          continue;
        }
        this.processDataInColumn(dataC, item, raw);
      }

      result.push(item);
    }

    this.dialogRef.close(result);
  }

  processDataInColumn(data: MiaImportDataColumn, item: any, raw: any) {
    if(data.column!.type == MiaImportColumn.TYPE_DOUBLE){
      this.processDataInColumnDouble(data, item, raw);
    } else if(data.column!.type == MiaImportColumn.TYPE_INT){
      this.processDataInColumnInt(data, item, raw);
    } else if(data.column!.type == MiaImportColumn.TYPE_STRING){
      this.processDataInColumnString(data, item, raw);
    } else if(data.column!.type == MiaImportColumn.TYPE_EMAIL){
      this.processDataInColumnString(data, item, raw);
    } else if(data.column!.type == MiaImportColumn.TYPE_DATE){
      this.processDataInColumnString(data, item, raw);
    }

    if(data.column!.moreFields && data.column!.moreFields.length > 0) {
      this.processMoreFields(data.column!, item);
    }
  }

  processMoreFields(column: MiaImportColumn, item: any) {
    for (const field of column.moreFields!) {
      this.processField(field, column, item);
    }
  }

  processField(field: MiaImportExtraField, column: MiaImportColumn, item: any) {
    if(field.type == MiaImportExtraField.TYPE_ADD && column.type != MiaImportColumn.TYPE_DOUBLE){
      item[field.field_key!] = field.value;
      return;
    }

    if(field.type == MiaImportExtraField.TYPE_FORMAT && column.type == MiaImportColumn.TYPE_DATE){
      let date = moment(item[column.field_key], field.value);
      item[column.field_key] = date.format('YYYY-MM-DD');
    }
  }

  processDataInColumnString(data: MiaImportDataColumn, item: any, raw: any) {
    let oldValue = item[data.column!.field_key];
    if(oldValue != undefined && oldValue != ''){
      item[data.column!.field_key] = oldValue + ' ' + raw[data.index];
    } else {
      item[data.column!.field_key] = raw[data.index];
    }
  }

  processDataInColumnDouble(data: MiaImportDataColumn, item: any, raw: any) {
    let oldValue = item[data.column!.field_key];
    let newValue = raw[data.index];

    if(oldValue == undefined){
      oldValue = 0;
    }

    if(newValue == undefined || newValue == ''){
      return;
    }

    if(data.column!.moreFields && data.column!.moreFields.length > 0) {
      for (const field of data.column!.moreFields) {
        if(field.type == MiaImportExtraField.TYPE_FORMAT){
          if(field.value == ','){
            newValue = newValue.replace('.', '');
            newValue = newValue.replace(',', '.');
          } else if (field.value == '.') {
            newValue = newValue.replace(',', '');
          }
        }
        if(field.type == MiaImportExtraField.TYPE_ADD) {
          item[field.field_key!] = field.value;
        }
      }
    }

    item[data.column!.field_key] = oldValue + parseFloat(newValue);
  }

  processDataInColumnInt(data: MiaImportDataColumn, item: any, raw: any) {
    let oldValue = item[data.column!.field_key];
    let newValue = raw[data.index];

    if(newValue == undefined || newValue == ''){
      return;
    }

    item[data.column!.field_key] = oldValue + parseInt(newValue);
  }

  onSelectDataColumn(select: MatSelectChange, dataColumn: MiaImportDataColumn) {
    let column: MiaImportColumn = select.value;
    dataColumn.column = column;
  }

  onProcessFiles(target: any) {
    if(!target.files || target.files.length <= 0){
      return;
    }

    this.filesSubject.next(target.files[0]);
  }

  generateFor() {
    for (let i = 0; i < this.dataNumberExistRow; i++) {
      this.dataColumns.push({ index: i, column: undefined });
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
    return this.config.columns;
    //return this.config.columns.filter(c => (c.columnIndex == index && c.unique == undefined) || c.columnIndex?.length == 0 || c.columnIndex == undefined);
  }
}
