import { EventEmitter } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";

export class ColumnConfig {
    name: string;
    description?: string;
    _class: string;
    options?: any;
    sticky?: string;
    sort?: boolean;
}

export interface CellComponent {
    column: ColumnConfig;
    row: object;
    modify?: EventEmitter<any>;
    modifyEnabled?: boolean;
    delete?: EventEmitter<any>;
    deleteEnabled?: boolean;
    select?: EventEmitter<any>;
    selection?: SelectionModel<any>;
}

export class ColumnFilter {
    column: ColumnConfig;
    filter: any;
}

export interface TableFilter {
    getFilter(): object;
}