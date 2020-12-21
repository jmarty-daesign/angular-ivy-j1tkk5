import { DatePipe } from '@angular/common';
import { TableFilter } from '../../../dynamic-table.model';

export class DateFilter implements TableFilter {
    
    fromDate: Date;
    toDate: Date;

    public constructor(private readonly column: string) {}
    
    /**
     * Retrieve a filter object for date data type.
     */
    getFilter(): object {
        const filter = {};
        if (this.fromDate && this.toDate)
            filter[this.column] = { ge: this.fromDate, le: this.toDate };
        else if (this.fromDate)
            filter[this.column] = { ge: this.fromDate };
        else if (this.toDate)
            filter[this.column] = { le: this.toDate };
        return filter;
    }

    /**
     * Get the filter description to display in the 
     * header filter icon hover.
     */
    getDescription() {
        if (!this.fromDate && !this.toDate)
            return null;
        const datePipe = new DatePipe('fr-FR');
        const formatDate = (date: Date) => datePipe.transform(date, 'shortDate');
        if (this.fromDate && this.toDate)
            return `Entre le ${formatDate(this.fromDate)} et le ${formatDate(this.toDate)}`;
        else if (this.fromDate)
            return `Après le ${formatDate(this.fromDate)}`;
        else if (this.toDate)
            return `Avant le ${formatDate(this.toDate)}`;        
    }
}