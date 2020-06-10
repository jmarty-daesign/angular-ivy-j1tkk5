import { Component, Input } from '@angular/core';
import { ColumnConfig } from '../../column-config.model';
import { CellComponent } from '../../dynamic-table.model';

@Component({
    selector: 'mdt-text-cell',
    template: '{{ row[column.name] }}'
})
export class TextCellComponent implements CellComponent {
    @Input() column: ColumnConfig;
    @Input() row: object;
}