import { TableFilter } from "../../../dynamic-table.model";

export class TextFilter implements TableFilter {
    value: string;

    public constructor(private readonly column: string) {
        this.value = '';
    }
    
    /**
     * Retrieve a filter object for text data type.
     */
    getFilter(): object {
        const filter = {};
        filter[this.column] = { contains: this.value };
        return filter;
    }

    /**
     * Get the filter description to display in the 
     * header filter icon hover.
     */
    getDescription() {
        if (!this.value) {
            return null;
        }
        return `Contient '${this.value}'`;        
    }
}