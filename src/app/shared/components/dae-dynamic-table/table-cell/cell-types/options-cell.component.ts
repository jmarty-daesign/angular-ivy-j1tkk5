import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColumnConfig } from '../../column-config.model';
import { CellComponent } from '../../dynamic-table.model';

@Component({
  selector: 'app-options',
  template: '<mat-menu #appMenu="matMenu">'
        +'<ng-container *ngIf="modifyEnabled"><button mat-menu-item (click)="modifyElement()">Modifier</button></ng-container>'
        +'<ng-container *ngIf="deleteEnabled"><button mat-menu-item (click)="deleteElement()">Supprimer</button></ng-container>'
        +'</mat-menu>'
        +'<button mat-icon-button color="primary" [matMenuTriggerFor]="appMenu">'
        +'<mat-icon>more_vert</mat-icon>'
        +'</button>'
})
export class OptionsCellComponent implements CellComponent {
    
    @Input() column: ColumnConfig;
    @Input() row: any;
    @Input() modifyEnabled: boolean;
    @Output() modify = new EventEmitter<any>();
    @Input() deleteEnabled: boolean;
    @Output() delete = new EventEmitter<any>();

    constructor() {}

    /**
     * Handle the modification event emitting.
     */
    modifyElement() {
        this.modify.emit(this.row);
    }

    /**
     * Handle the deletion event emitting.
     */
    deleteElement() {
      this.delete.emit(this.row);
    }

}
