import { Component, Input } from '@angular/core';
import { CellComponent, ColumnConfig } from '../../dynamic-table.model';

@Component({
    selector: 'mdt-text-cell',
    template: '<div *ngIf="!!column.link; else text" class="text-cell-link" [routerLink]="[row[column.link]]">{{ row[column.tag] }}</div>'
             +'<ng-template #text>{{ row[column.tag] }}</ng-template>'
})
export class TextCellComponent implements CellComponent {
    @Input() column: ColumnConfig;
    @Input() row: object;
}