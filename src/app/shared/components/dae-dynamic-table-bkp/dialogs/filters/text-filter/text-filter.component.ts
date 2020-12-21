import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TextFilter } from './text-filter.model';
import { ColumnFilter } from '../../../dynamic-table.model';

@Component({
    selector: 'ld-text-filter',
    templateUrl: './text-filter.component.html'
})
export class TextFilterComponent implements OnInit {

    model: TextFilter;
    displayName: string;

    public constructor(
        private readonly dialogRef: MatDialogRef<TextFilterComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly filterData: ColumnFilter) { }

    /**
     * Component initialization lifecycle hook.
     */
    ngOnInit() {
        this.displayName = this.filterData.column.localname;
        this.model = this.filterData.filter || new TextFilter(this.filterData.column.tag);
    }

    /**
     * Triggers the text filter apply and close the dialog.
     */
    apply() {
        if (this.model.value)
            this.dialogRef.close(this.model);
        else
            this.dialogRef.close('');
    }
}