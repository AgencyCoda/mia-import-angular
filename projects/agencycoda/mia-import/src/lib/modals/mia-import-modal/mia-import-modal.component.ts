import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MiaImportConfig } from '../../entities/mia-import-config';

@Component({
  selector: 'lib-mia-import-modal',
  templateUrl: './mia-import-modal.component.html',
  styleUrls: ['./mia-import-modal.component.css']
})
export class MiaImportModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MiaImportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MiaImportConfig,
  ) { }

  ngOnInit(): void {
  }

}
