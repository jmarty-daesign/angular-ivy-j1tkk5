import { TableFilter } from "../../../dynamic-table.model";

export class NumberFilter implements TableFilter {
    minValue: number;
    maxValue: number;

    public constructor(private readonly column: string) {
    }
    
    /**
     * Retrieve a filter object for number data type.
     */
    getFilter(): object {
        const filter = {};
        if (this.minValue && this.maxValue)
            filter[this.column] = { ge: this.minValue, le: this.maxValue };
        else if (this.minValue)
            filter[this.column] = { ge: this.minValue };
        else if (this.maxValue)
            filter[this.column] = { le: this.maxValue };
        return filter;
    }

    /**
     * Get the filter description to display in the 
     * header filter icon hover.
     */
    getDescription() {
        if (!this.minValue && !this.maxValue)
            return null;
        if (this.minValue && this.maxValue)
            return `Entre ${this.minValue} et ${this.maxValue}`;
        else if (this.minValue)
            return `Supérieur à ${this.minValue}`;
        else if (this.maxValue)
            return `Inférieur à ${this.maxValue}`;       
    }
}