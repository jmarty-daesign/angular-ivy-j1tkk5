import { Component, Input, OnInit } from '@angular/core';
import { CellComponent, ColumnConfig } from '../../dynamic-table.model';

@Component({
    selector: 'mdt-array-cell',
    templateUrl: './array-cell.component.html'
})
export class ArrayCellComponent implements CellComponent, OnInit {
    
    @Input() column: ColumnConfig;
    @Input() row: object;

    ngOnInit() { }
}