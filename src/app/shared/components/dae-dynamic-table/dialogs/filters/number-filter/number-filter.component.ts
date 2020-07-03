import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NumberFilter } from './number-filter.model';
import { ColumnFilter } from '../../../dynamic-table.model';

@Component({
    selector: 'ld-number-filter',
    templateUrl: './number-filter.component.html'
})
export class NumberFilterComponent implements OnInit {

    model: NumberFilter;
    displayName: string;

    public constructor(
        private readonly dialogRef: MatDialogRef<NumberFilterComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly filterData: ColumnFilter) { }

    /**
     * Component initialization lifecycle hook.
     */    
    ngOnInit() {
        this.displayName = this.filterData.column.description;
        this.model = this.filterData.filter || new NumberFilter(this.filterData.column.name);
    }

    /**
     * Triggers the number filter apply and close the dialog.
     */
    apply() {
        if (this.model.minValue || this.model.maxValue)
            this.dialogRef.close(this.model);
        else
            this.dialogRef.close('');
    }

    /**
     * Get a new number filter object for a given column
     * @param columnName 
     */
    getFilter(columnName: string) {
        return new NumberFilter(columnName);
    }
}