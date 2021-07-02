import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MiaImportExtraField } from '../../entities/mia-import-column';

@Component({
  selector: 'mia-field-extra',
  templateUrl: './mia-field-extra.component.html',
  styleUrls: ['./mia-field-extra.component.css']
})
export class MiaFieldExtraComponent implements OnInit {

  @Input() field!: MiaImportExtraField;

  constructor() { }

  ngOnInit(): void {
  }

  onSelectOption(select: MatSelectChange) {
    this.field.value = select.value;
  }
}
