import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {
  constructor() { }

  /**
   * Map the questions array to a reactive form group with necessary validators.
   * @param questions 
   */
  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};
    questions.forEach(question => {
      const formState = { value: question.value || '', disabled: !question.editable };
      group[question.key] = question.required ? new FormControl(formState, Validators.required)
                                              : new FormControl(formState);
    });
    return new FormGroup(group);
  }
}