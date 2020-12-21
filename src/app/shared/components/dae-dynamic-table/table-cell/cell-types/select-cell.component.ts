import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CellComponent, ColumnConfig } from '../../dynamic-table.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-select',
  template: '<mat-checkbox color="primary" (click)="$event.stopPropagation()"'
            + '[checked]="selection.isSelected(row)"'
            + '(change)="selectElement(row)">'
            +'</mat-checkbox>'
})
export class SelectCellComponent implements CellComponent {
    
    @Input() column: ColumnConfig;
    @Input() row: any;
    @Input() selection = new SelectionModel<any>();
    @Output() select = new EventEmitter<any>();

    constructor() {
    }    

    /**
     * Trigger the event emitting for row selection.
     * @param row 
     */
    selectElement(row: any) {
      this.select.emit(row);
    }

}
