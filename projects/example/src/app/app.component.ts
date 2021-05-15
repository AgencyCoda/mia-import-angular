import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MiaImportColumn, MiaImportConfig, MiaImportModalComponent } from 'projects/agencycoda/mia-import/src/public-api';

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
        field_option: 'currency_debit', options: [
          { id: 1, title: 'USD' },
          { id: 2, title: 'ARS' },
        ] 
      },
      { title: 'Amount Credit', field_key: 'amount_credit', type: MiaImportColumn.TYPE_DOUBLE,
        field_option: 'currency_credit', options: [
          { id: 1, title: 'USD' },
          { id: 2, title: 'ARS' },
        ]
      },
      { title: 'Amount', field_key: 'amount', type: MiaImportColumn.TYPE_DOUBLE,
        field_option: 'currency', options: [
          { id: 1, title: 'USD' },
          { id: 2, title: 'ARS' },
        ]
      },
      { title: 'Date', field_key: 'date', type: MiaImportColumn.TYPE_DATE },
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
