import { Injectable }       from '@angular/core';
import { DropdownQuestion } from './question-dropdown';
import { QuestionBase }     from './question-base';
import { TextboxQuestion }  from './question-textbox';
import { DatepickerQuestion }  from './question-datepicker';
import { RadioQuestion }    from './question-radio';

@Injectable()
export class QuestionService {

  /**
   * Retrieve the object value from its relavant "name" property.
   * @param dataObject The object definition.
   * @param data The data record.
   */
  private _getValueFromObject(dataObject: any, data?: any) {
    return !!data ? data[dataObject.name] : '';
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
        key: dataObject.name,
        label: dataObject.description,
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
      key: dataObject.name,
      label: dataObject.description,
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
  private _getDropdownQuestion(dataObject: any, index: number, options: {key: string, value: string}[], data?: any) {
    return new DropdownQuestion({
      key: dataObject.name,
      label: dataObject.description,
      order: index,
      options: options,
      value: this._getValueFromObject(dataObject, data)
    });
  }  

  /**
   * Get questions from the data schema and data type.
   * @param dataSchema The object data definition.
   * @param data The data record.
   */
  public getQuestions(dataSchema: any[], data?: any) {
    let questions: QuestionBase<any>[] = [];
    dataSchema.forEach((schema, index) => {
        let question = this._getQuestion(schema, index, data);
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
  private _getQuestion(schema: any, index: number, data?: any) {
    let question: QuestionBase<any>;
    switch (schema._class) {
        case 'date':
            question = this._getDatepickerQuestion(schema, index, data);
            break;
        case 'string' || 'number':
            question = this._getTextboxQuestion(schema, index, data);
            break;
    }
    return question;
  }

}