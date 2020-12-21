import { Component, ComponentFactoryResolver, Input, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { CellDirective } from './cell.directive';
import { CellService } from './cell-types/cell.service';
import { CellComponent, ColumnConfig } from '../dynamic-table.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'mdt-table-cell',
    template: '<ng-template mdtCellHost></ng-template>'
})
export class TableCellComponent implements OnInit {
    
    @ViewChild(CellDirective) cellHost: CellDirective;

    @Input() row: object;
    @Input() column: ColumnConfig;
    @Input() selection: SelectionModel<any>;
    @Input() modifyEnabled: boolean;
    @Output() modifyElement = new EventEmitter<any>();
    @Input() deleteEnabled: boolean;
    @Output() deleteElement = new EventEmitter<any>();
    @Output() selectElement = new EventEmitter<any>();

    constructor(
        private readonly cellService: CellService,
        private readonly componentFactoryResolver: ComponentFactoryResolver) { }

    /**
     * Component initialization lifecycle hook.
     */
    ngOnInit() {
        this._initCell();
    }

    /**
     * Initialize the cell from component factory regarding the cell data type.
     */
    private _initCell() {
        const cellComponent = this.cellService.getCell(this.column.type);
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(cellComponent);
        const componentRef = this._createComponentFromFactory(componentFactory);
        const cell = this._mapCell(componentRef);
        this._handleModify(cell);
        this._handleDelete(cell);
        this._handleSelect(cell);
    }

    /**
     * Component creation from component factory.
     * @param componentFactory The component factory for a given cell data type.
     */
    private _createComponentFromFactory(componentFactory) {
        const viewContainerRef = this.cellHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        return componentRef;
    }

    /**
     * Map row and columns on a cell.
     * @param componentRef Component reference from the factory.
     */
    private _mapCell(componentRef) {
        const cell = componentRef.instance as CellComponent;
        cell.row = this.row;
        cell.column = this.column;
        cell.modifyEnabled = this.modifyEnabled;
        cell.deleteEnabled = this.deleteEnabled;
        return cell;
    }

    /**
     * Handle the object deletion event emitting.
     * @param cell The originate cell.
     */
    private _handleDelete(cell: CellComponent) {
        if (cell.delete)
            cell.delete.subscribe((row) => this.deleteElement.emit(row));
    }

    /**
     * Handle the object modification event emitting.
     * @param cell The originate cell.
     */
    private _handleModify(cell: CellComponent) {
        if (cell.modify)
            cell.modify.subscribe((row) => this.modifyElement.emit(row));
    }

    /**
     * Handle the selection event emitting.
     * @param cell The originate cell.
     */
    private _handleSelect(cell: CellComponent) {
        if (cell.selection)
            cell.selection = this.selection;
        if (cell.select)
            cell.select.subscribe((row) => this.selectElement.emit(row));
    }

}
