import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { TableCellComponent } from './table-cell/table-cell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CellService } from './table-cell/cell-types/cell.service';
import { CellDirective } from './table-cell/cell.directive';
import { ColumnFilterService } from './table-cell/cell-types/column-filter.service';
export { CellService, CellDirective, ColumnFilterService };
import { TextCellComponent } from './table-cell/cell-types/text-cell.component';
import { DateCellComponent } from './table-cell/cell-types/date-cell.component';
import { NumberFilterComponent } from './dialogs/filters/number-filter/number-filter.component';
import { TextFilterComponent } from './dialogs/filters/text-filter/text-filter.component';
import { DateFilterComponent } from './dialogs/filters/date-filter/date-filter.component';
import { DaeDatatableHeaderModule } from '../dae-datatable-header/dae-datatable-header.module';
import { ColumnsSelectComponent } from './dialogs/columns-select/columns-select.component';
import { OptionsCellComponent } from './table-cell/cell-types/options-cell.component';
import { DynamicFormModule } from '../dae-dynamic-form/dynamic-form.module';
import { DaeOverlaySpinnerModule } from '../dae-overlay-spinner/dae-overlay-spinner.module';
import { SelectCellComponent } from './table-cell/cell-types/select-cell.component';
import { ArrayCellComponent } from './table-cell/cell-types/array-cell.component';
import { ArrayFilterComponent } from './dialogs/filters/array-filter/array-filter.component';
import { RouterModule } from '@angular/router';
import { IconCellComponent } from './table-cell/cell-types/icon-cell.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    DaeDatatableHeaderModule,
    DynamicFormModule,
    DaeOverlaySpinnerModule
  ],
  declarations: [
    DynamicTableComponent,
    TableCellComponent,
    CellDirective,
    TextCellComponent,
    DateCellComponent,
    TextFilterComponent,
    DateFilterComponent,
    NumberFilterComponent,
    ArrayFilterComponent,
    ColumnsSelectComponent,
    OptionsCellComponent,
    SelectCellComponent,
    ArrayCellComponent,
    IconCellComponent
  ],
  exports: [DynamicTableComponent],
  entryComponents: [
    TextCellComponent,
    DateCellComponent,
    OptionsCellComponent,
    SelectCellComponent,
    ArrayCellComponent,
    IconCellComponent,
    TextFilterComponent,
    DateFilterComponent,
    NumberFilterComponent,
    ArrayFilterComponent,
    ColumnsSelectComponent
  ],
  providers: [
    CellService,
    ColumnFilterService
  ]
})
export class DynamicTableModule {
  constructor(private readonly cellService: CellService,
      private readonly columnFilterService: ColumnFilterService) {
    cellService.registerCell('string', TextCellComponent);
    cellService.registerCell('date', DateCellComponent);
    cellService.registerCell('options', OptionsCellComponent);
    cellService.registerCell('select', SelectCellComponent);
    cellService.registerCell('array', ArrayCellComponent);
    cellService.registerCell('icon', IconCellComponent);
    columnFilterService.registerFilter('string', TextFilterComponent);
    columnFilterService.registerFilter('date', DateFilterComponent);
    columnFilterService.registerFilter('number', NumberFilterComponent);
    columnFilterService.registerFilter('array', ArrayFilterComponent);
  }
}
