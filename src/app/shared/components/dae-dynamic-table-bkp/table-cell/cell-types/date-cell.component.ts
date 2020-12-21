import { Component, Input, OnInit } from '@angular/core';
import { CellComponent, ColumnConfig } from '../../dynamic-table.model';
import * as moment from 'moment';

@Component({
    selector: 'mdt-date-cell',
    template: '{{ row[column.tag] | date:dateFormat:timezone:locale }}'
})
export class DateCellComponent implements CellComponent, OnInit {
    @Input() column: ColumnConfig;
    @Input() row: object;

    dateFormat = 'short';
    timezone = '';
    locale = moment.locale();

    /**
     * Component initialization lifecycle hook.
     */
    ngOnInit() {
        if (!!this.column.options && this.column.options.dateFormat)
            this.dateFormat = this.column.options.dateFormat;
    }
}