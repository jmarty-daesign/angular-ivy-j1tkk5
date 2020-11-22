import { Component, Input, OnInit } from '@angular/core';
import { CellComponent, ColumnConfig } from '../../dynamic-table.model';

@Component({
    selector: 'mdt-icon-cell',
    template: '<mat-icon [matTooltip]="!row[column.tag] ? column.iconTooltip : null" [ngClass]="column.iconsMap[row[column.tag]].icon_class">'
        + '{{ column.iconsMap[row[column.tag]].icon }}</mat-icon>'
})
export class IconCellComponent implements CellComponent, OnInit {
    
    @Input() column: ColumnConfig;
    @Input() row: object;

    /**
     * Component initialization lifecycle hook.
     */
    ngOnInit() {
    }
}