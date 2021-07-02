import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

/** ANGULAR MATERIAL */
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

/** COMPONENTS */
import { MiaImportComponent } from './mia-import.component';
import { MiaImportModalComponent } from './modals/mia-import-modal/mia-import-modal.component';
import { MiaFieldExtraComponent } from './components/mia-field-extra/mia-field-extra.component';

@NgModule({
  declarations: [MiaImportComponent, MiaImportModalComponent, MiaFieldExtraComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    /** MATERIAL */
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    MiaImportComponent,
    MiaImportModalComponent
  ],
  entryComponents: [
    MiaImportComponent
  ],
})
export class MiaImportModule { }
