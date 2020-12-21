import { Injectable }       from '@angular/core';
import { DropdownQuestion } from './question-dropdown';
import { QuestionBase }     from './question-base';
import { TextboxQuestion }  from './question-textbox';
import { DatepickerQuestion }  from './question-datepicker';
import { RadioQuestion }    from './question-radio';
import { IDictionary, IMap } from '../../dae-dynamic-table/dynamic-table.model';

@Injectable()
export class QuestionService {

  /**
   * Retrieve the object value from its relavant "name" property.
   * @param dataObject The object definition.
   * @param data The data record.
   */
  private _getValueFromObject(dataObject: any, data?: any) {
    return !!data ? data[dataObject.tag] : '';
  }

  /**
   * Builds a datepicker component if dataobject is of type date.
   * @param dataObject The object definition.
   * @param index The index of the element in the data object.
   * @param data The data record.
   */
  private _getDatepickerQuestion(dataObject: any, index: number, data?: any) {
    return new DatepickerQuestion({
        key: dataObject.name,
        label: dataObject.description,
        required: dataObject.required,
        order: index,
        value: this._getValueFromObject(dataObject, data)
      });
  }

  /**
   * Builds a textbox component if dataobject is of type text.
   * @param dataObject The object definition.
   * @param index The index of the element in the data object.
   * @param data The data record.
   */
  private _getTextboxQuestion(dataObject: any, index: number, data?: any) {
    return new TextboxQuestion({
        key: dataObject.tag,
        label: dataObject.localname,
        required: dataObject.required,
        order: index,
        value: this._getValueFromObject(dataObject, data)
      });
  }

  /**
   * Builds radio buttons component if dataobject is of type boolean.
   * @param dataObject The object definition.
   * @param index The index of the element in the data object.
   * @param data The data record.
   */
  private _getRadioQuestion(dataObject: any, index: number, options: {key: string, value: string}[], data?: any) {
    return new RadioQuestion({
      key: dataObject.tag,
      label: dataObject.localname,
      order: index,
      options: options,
      value: this._getValueFromObject(dataObject, data)
    });
  }

  /**
   * Builds a dropdown component if dataobject is of type list.
   * @param dataObject The object definition.
   * @param index The index of the element in the data object.
   * @param data The data record.
   */
  private _getDropdownQuestion(dataObject: any, index: number, options: IDictionary<IMap[]>, data?: any) {
    return new DropdownQuestion({
      key: dataObject.tag,
      label: dataObject.localname,
      order: index,
      options: options[dataObject.tag],
      value: this._getValueFromObject(dataObject, data)
    });
  }  

  /**
   * Get questions from the data schema and data type.
   * @param dataSchema The object data definition.
   * @param data The data record.
   */
  public getQuestions(dataSchema: any[], data?: any, options?: IDictionary<IMap[]>) {
    let questions: QuestionBase<any>[] = [];
    dataSchema.forEach((schema, index) => {
        let question = this._getQuestion(schema, index, data, options);
        if (!!question) questions.push(question);
    });
    return questions.sort((a, b) => a.order - b.order);
  }

  /**
   * Switch the question type regarding the data type.
   * @param schema The object data definition.
   * @param index The index of the element in the data object.
   * @param data The data record.
   */
  private _getQuestion(schema: any, index: number, data?: any, options?: IDictionary<IMap[]>) {
    let question: QuestionBase<any>;
    question = this._getQuestionByType(schema, question, index, data, options);
    if ( !!question )
      this._setQuestionEditMode(schema, question);
    return question;
  }

  /**
   * Handles the edit mode for given question regarding schema definition.
   * @param schema The question data model schema.
   * @param question The question to set edit mode for.
   */
  private _setQuestionEditMode(schema: any, question: QuestionBase<any>) {
    switch (schema.mode) {
      case 1:
        question.editable = false;
        break;
      case 3:
        question.editable = true;
        break;
      case 7:
        question.editable = true;
        question.deletable = true;
        break;
    }
  }

  /**
   * Retrieve the question object regarding the data type.
   * @param schema The object data definition.
   * @param question The question object to setup.
   * @param index The index of the element in the data object.
   * @param data The data record.
   */
  private _getQuestionByType(schema: any, question: QuestionBase<any>, index: number, data: any, options?: IDictionary<IMap[]>) {
    switch (schema.type) {
      case 'date':
        question = this._getDatepickerQuestion(schema, index, data);
        break;
      case 'string':
      case 'number':
      case 'objectid':
        question = this._getTextboxQuestion(schema, index, data);
        break;
      case 'list':  
        question = this._getDropdownQuestion(schema, index, options, data);
        break;
    }
    return question;
  }

}