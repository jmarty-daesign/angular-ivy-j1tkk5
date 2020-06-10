import { Component, OnInit, Inject } from '@angular/core';
import { ColumnConfig } from '../../column-config.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-columns-select',
  templateUrl: './columns-select.component.html',
  styleUrls: ['./columns-select.component.scss']
})
export class ColumnsSelectComponent implements OnInit {

  form: FormGroup;
  filteredData: any;
  filteredColumns: any;

  constructor(private formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<ColumnsSelectComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: any) { 
  }

  /**
   * Component lifecycle initialization hook.
   */
  ngOnInit() {
    this._initializeForm();
    this._filterColumns();
    this._addCheckboxes();
  }

  /**
   * Getter for the form controls array
   */
  get columnsFormControls() { 
    return (<FormArray>this.form.get('columns')).controls; 
  }

  /**
   * Remove select and options to only display data columns.
   */
  private _filterColumns() {
    this.filteredColumns = this.data.columns.slice().filter(column => 
      column.name != 'select' && column.name != 'options'
    );
  }

  /**
   * Create the reactive form.
   */
  private _initializeForm() {
    this.form = this.formBuilder.group({
      columns: new FormArray([], this.minSelectedCheckboxes(1))
    });
  }

  /**
   * Add the columns checkboxes to the form
   */
  private _addCheckboxes() {
    this.filteredColumns.forEach((column, i) => {
      let columnSelected: boolean = false;
      if ( this.data.displayedColumns.includes(column.name))
        columnSelected = true;
      const control = new FormControl(columnSelected);
      (this.form.controls.columns as FormArray).push(control);
    });
  }

  /**
   * Submit the form to display columns according to the selection
   * and re-add the select and options columns.
   */
  public submit() {
    const selectedColumnsNames = this.form.value.columns
      .map((columnSelected, index) => 
        columnSelected ? this.filteredColumns[index].name : null)
      .filter(v => v !== null);
    selectedColumnsNames.splice(0,0,"select");
    selectedColumnsNames.push("options");
    this.dialogRef.close({ selectedColumns: selectedColumnsNames });
  }

  /**
   * Custom form validator for minimal column selection
   * @param min The minimum value for selected columns count
   */
  public minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
      return totalSelected >= min ? null : { required: true };
    };
    return validator;
  }

}
