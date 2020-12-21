import { ColumnConfig, EFilterOperator, TableFilter } from '../../../dynamic-table.model';

export class ArrayFilter implements TableFilter {
    
    elements: any[];
    operator: EFilterOperator;
    referenceField: string;

    public constructor(private readonly column: ColumnConfig) {}
    
    /**
     * Retrieve a filter object for date data type.
     */
    getFilter(): object {
        const filter = {};
        filter[this.column.tag] = { 
            elements: this.elements, 
            operator: this.operator,
            referenceField: this.column.ref
        };
        return filter;
    }

    /**
     * Get the filter description to display in the 
     * header filter icon hover.
     */
    getDescription() {
        const description = ( this.elements.length > 1 && !!this.operator ) ? this.elements.join(` ${this.operator.toLowerCase()} `) : this.elements[0];
        return !this.elements ? null : `Contient : ${description}`;
    }
}