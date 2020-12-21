import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormDialogComponent } from './dialog/dynamic-form-dialog.component';
import { QuestionService } from './question/question.service';
import { DynamicFormQuestionComponent } from './question/dynamic-form-question.component';
import { MaterialModule } from '../../material.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    DynamicFormComponent,
    DynamicFormDialogComponent,
    DynamicFormQuestionComponent
  ],
  exports: [
    DynamicFormComponent,
    DynamicFormDialogComponent,
    DynamicFormQuestionComponent
  ],
  entryComponents: [
    DynamicFormDialogComponent
  ],
  providers: [
    QuestionService
  ]
})
export class DynamicFormModule {
  constructor() {
  }
}
