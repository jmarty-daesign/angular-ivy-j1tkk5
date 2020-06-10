import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaeDatatableHeaderComponent } from './dae-datatable-header.component';
import { MaterialModule } from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DaeDatatableHeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    DaeDatatableHeaderComponent
  ]
})
export class DaeDatatableHeaderModule { }
