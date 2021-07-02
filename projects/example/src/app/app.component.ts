import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MiaImportColumn, MiaImportConfig, MiaImportExtraField, MiaImportModalComponent } from 'projects/agencycoda/mia-import/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    protected dialog: MatDialog
  ) {
    
  }

  onClickStart() {
    let config = new MiaImportConfig();
    config.title = 'Importación de Cuenta';
    config.columns = [
      { title: 'Description', field_key: 'title', type: MiaImportColumn.TYPE_STRING },
      { title: 'Amount Debit', field_key: 'amount_debit', type: MiaImportColumn.TYPE_DOUBLE,
        moreFields: [
          { type: MiaImportExtraField.TYPE_ADD, title: 'Tipo de moneda', field_key: 'currency_debit', field_type: MiaImportExtraField.FIELD_TYPE_SELECT, options: [ { id: 1, title: 'USD' }, { id: 2, title: 'ARS' }, ] }
        ]
      },
      { title: 'Amount Credit', field_key: 'amount_credit', type: MiaImportColumn.TYPE_DOUBLE,
        moreFields: [
          { type: MiaImportExtraField.TYPE_ADD, title: 'Tipo de moneda', field_key: 'currency_credit', field_type: MiaImportExtraField.FIELD_TYPE_SELECT, options: [ { id: 1, title: 'USD' }, { id: 2, title: 'ARS' }, ] }
        ]
      },
      { title: 'Amount', field_key: 'amount', type: MiaImportColumn.TYPE_DOUBLE,
      moreFields: [
        { type: MiaImportExtraField.TYPE_ADD, title: 'Tipo de moneda', field_key: 'currency', field_type: MiaImportExtraField.FIELD_TYPE_SELECT, options: [ { id: 1, title: 'USD' }, { id: 2, title: 'ARS' }, ] },
        { type: MiaImportExtraField.TYPE_FORMAT, title: 'Separador de decimal', value: ',', field_type: MiaImportExtraField.FIELD_TYPE_INPUT }
      ]
      },
      { title: 'Date', field_key: 'date', type: MiaImportColumn.TYPE_DATE, unique: true, moreFields: [
        { type: MiaImportExtraField.TYPE_FORMAT, title: 'Formato de fecha (YYYY-MM-DD)', field_type: MiaImportExtraField.FIELD_TYPE_INPUT }
      ] },
      { title: 'Notes', field_key: 'caption', type: MiaImportColumn.TYPE_STRING },
    ];

    this.dialog.open(MiaImportModalComponent, {
      width: '520px',
      panelClass: 'modal-full-width-mobile',
      data: config
    }).afterClosed().subscribe(result => {
      if(result){
        console.log('--IMPORT--');
        console.log(result);
      }
    });
  }

  convertToDouble(item: any) {
    return parseFloat(item);
  }

}
