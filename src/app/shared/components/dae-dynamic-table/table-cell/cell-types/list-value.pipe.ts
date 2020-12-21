import { Pipe, PipeTransform } from '@angular/core';
import { ColumnConfig, IDictionary, IMap } from '../../dynamic-table.model';

@Pipe({
  name: 'listValue'
})
export class ListValuePipe implements PipeTransform {

  transform(value: any, column: ColumnConfig, lists: IDictionary<IMap[]>): any {
    return lists[column.tag].find(lv => lv.key === value[column.tag]);
  }

}
