import { EventEmitter } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
export class ColumnConfig {
    tag: string;
    localname?: string;
    type: string;
    ref?: string;
    mode?: number;
    indice?: string;
    visible?: number;
    options?: any;
    link?: string;
    iconsMap?: any;
    iconTooltip?: string;
}

export interface CellComponent {
    column: ColumnConfig;
    row: object;
    lists?: IDictionary<any[]>;
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
    elements?: any[];
}

export interface TableFilter {
    getFilter(): object;
}

export enum ElocalStorageItem {
    COLUMN = 'columns',
    FILTERS = 'filters',
    SEARCH = 'search'
}

export enum EFilterOperator {
    OR = 'OU',
    AND = 'ET'
}

export interface IDictionary<T> {
    [Key: string]: T;
}

export interface IMap {
    key: string;
    value: any;
}