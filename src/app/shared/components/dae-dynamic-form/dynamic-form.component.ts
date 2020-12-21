import { Component, Input, OnInit, Output, EventEmitter }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { QuestionBase }              from './question/question-base';
import { QuestionControlService }    from './question/question-control.service';

@Component({
  selector: 'dae-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Input() isDialog: boolean;

  @Output() close = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>();

  form: FormGroup;
  payLoad = '';

  
  constructor(private _qcs: QuestionControlService) {  }

  /**
   * Component initialization lifecycle hook.
   */
  ngOnInit() {
    this.form = this._qcs.toFormGroup(this.questions);
  }

  /**
   * Handles the form submission.
   * Add the object id if we are in edit mode.
   */
  onSubmit() {
    if ( !!this.form.controls && !!this.form.controls._id )
      this.form.value["_id"] = this.form.controls._id.value;
    this.submit.emit(this.form.value);
  }

  /**
   * Handles the form cancellation.
   */
  onCancel() {
    this.close.emit(null);
  }
}