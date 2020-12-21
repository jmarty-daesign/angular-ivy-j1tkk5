import { Component, Input, OnInit } from '@angular/core';
import { CellComponent, ColumnConfig, IDictionary } from '../../dynamic-table.model';

@Component({
    selector: 'mdt-list-cell',
    template: '{{ (row | listValue:column:lists)?.value }}'
})
export class ListCellComponent implements CellComponent, OnInit {
    
    @Input() column: ColumnConfig;
    @Input() row: object;
    @Input() lists: IDictionary<any[]>;

    ngOnInit() { }
}