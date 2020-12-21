import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArrayFilter } from './array-filter.model';
import { DateAdapter, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { ColumnFilter, EFilterOperator } from '../../../dynamic-table.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operator/startWith';
import { map } from 'rxjs/operators';

@Component({
    selector: 'ld-array-filter',
    styleUrls: ["./array-filter.component.scss"],
    templateUrl: './array-filter.component.html'
})
export class ArrayFilterComponent implements OnInit {

    model: ArrayFilter;
    displayName: string;
    operators: EFilterOperator[] = [ EFilterOperator.AND, EFilterOperator.OR ];
    defaultFilterOperator = EFilterOperator.AND;
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    elementControl = new FormControl();
    filteredElements: Observable<string[]>;
    allElements: string[] = [];

    @ViewChild('elementInput') elementInput: ElementRef;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    public constructor(
        private readonly dialogRef: MatDialogRef<ArrayFilterComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly filterData: ColumnFilter,
        private dateAdapter: DateAdapter<Date>) { 
            this.dateAdapter.setLocale('fr');  
            this.filteredElements = this.elementControl.valueChanges.pipe(
                // startWith(null),
                map((element: string | null) => 
                    element ? this._filter(element) : this.allElements.slice()
                )
            );
    }

    /**
     * Component initialization lifecycle hook.
     */
    public ngOnInit() {
        this.displayName = this.filterData.column.localname;
        this.allElements = this.filterData.elements;
        this.model = this.filterData.filter || new ArrayFilter(this.filterData.column);
        if ( !this.model.elements ){
            this.model.elements = [];
        }
    }

    /**
     * Triggers the date filter apply and close the dialog.
     */
    public apply() {
        this.dialogRef.close(this.model);
    }

    // /**
    //  * Add an element chip to the input
    //  * @param event The chip input event.
    //  */
    // public addElement(event: MatChipInputEvent): void {
    //     const input = event.input;
    //     const value = event.value;
    //     if ((value || '').trim()) {
    //         this.model.elements.push(value.trim());
    //     }
    //     if (input) {
    //         input.value = '';
    //     }    
    //     this.elementControl.setValue(null);
    // }
    
    /**
     * Remove an element chip from the input.
     * @param element The element to remove.
     */
    public removeElement(element: string): void {
        const index = this.model.elements.indexOf(element);
        if (index >= 0) {
            this.model.elements.splice(index, 1);
        }
    }

    /**
     * Handles the display of element in chip (with object attribute reference).
     * @param element The element to display text for.
     */
    public displayElementFunction(element: any): string {
        const elementDisplayText = this.filterData.column.ref;
        return element && elementDisplayText ? elementDisplayText : '';
    }

    /**
     * Handle the selected options array.
     * @param event The selected option.
     */
    public selected(event: MatAutocompleteSelectedEvent): void {
        this.model.elements.push(event.option.viewValue);
        this._handleDefaultOperator();
        this._resetElementInput();
    }

    /**
     * Reset the element input.
     */
    private _resetElementInput() {
        this.elementInput.nativeElement.value = '';
        this.elementControl.setValue(null);
    }

    /**
     * Select the default operator if array length is more than 1.
     */
    private _handleDefaultOperator() {
        if (this.model.elements.length > 1) {
            this.model.operator = this.defaultFilterOperator;
        }
    }

    /**
     * Filter the elements list based on the input value.
     * @param value The typed string or the selected element.
     */
    private _filter(value: any): string[] {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : value[this.filterData.column.ref].toLowerCase();
        return this.allElements
            .filter(element => !this.model.elements.includes(element[this.filterData.column.ref]))
            .filter(element => element[this.filterData.column.ref].toLowerCase().indexOf(filterValue) === 0);
    }

}