import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaeDatatableHeaderComponent } from './dae-datatable-header.component';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DaeDatatableHeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    DaeDatatableHeaderComponent
  ]
})
export class DaeDatatableHeaderModule { }
