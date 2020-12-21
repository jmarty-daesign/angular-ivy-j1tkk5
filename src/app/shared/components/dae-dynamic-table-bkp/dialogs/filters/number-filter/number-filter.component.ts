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
        this.displayName = this.filterData.column.localname;
        this.model = this.filterData.filter || new NumberFilter(this.filterData.column.tag);
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
}