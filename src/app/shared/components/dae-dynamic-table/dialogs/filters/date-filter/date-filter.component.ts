import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateFilter } from './date-filter.model';
import { DateAdapter } from '@angular/material';
import { ColumnFilter } from '../../../dynamic-table.model';

@Component({
    selector: 'ld-date-filter',
    templateUrl: './date-filter.component.html'
})
export class DateFilterComponent implements OnInit {

    model: DateFilter;

    displayName: string;

    public constructor(
        private readonly dialogRef: MatDialogRef<DateFilterComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly filterData: ColumnFilter,
        private dateAdapter: DateAdapter<Date>) { 
            this.dateAdapter.setLocale('fr');   
        }

    /**
     * Component initialization lifecycle hook.
     */
    ngOnInit() {
        this.displayName = this.filterData.column.description;
        this.model = this.filterData.filter || new DateFilter(this.filterData.column.name);
    }

    /**
     * Triggers the date filter apply and close the dialog.
     */
    apply() {
        if (this.model.fromDate || this.model.toDate) {
            this.dialogRef.close(this.model);
        } else {
            this.dialogRef.close('');
        }
    }

    /**
     * Get a new date filter object for a given column
     * @param columnName 
     */
    getFilter(columnName: string) {
        return new DateFilter(columnName);
    }
}