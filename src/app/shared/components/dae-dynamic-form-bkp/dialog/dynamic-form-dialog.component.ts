import { Component, Input, OnInit, Inject, Output, EventEmitter }  from '@angular/core';
import { QuestionBase }              from '../question/question-base';
import { QuestionControlService }    from '../question/question-control.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'dae-dynamic-form-dialog',
  templateUrl: './dynamic-form-dialog.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormDialogComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<DynamicFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {  
      this.questions = this.data.questions;
    }

  /**
   * Component initialization lifecycle hook.
   */
  ngOnInit() {
  }

  /**
   * Handles the dialog closing.
   */
  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * Handles the form submission regarding the editing mode.
   * @param formValue The form data to submit.
   */
  submitForm(formValue: any) {
    this.dialogRef.close(formValue);
    this.data.mode == 'create' ? this.add.emit(formValue) : this.edit.emit(formValue);
  }

}

export interface DialogData {
  questions: QuestionBase<any>[];
  title: string;
  mode: string;
}