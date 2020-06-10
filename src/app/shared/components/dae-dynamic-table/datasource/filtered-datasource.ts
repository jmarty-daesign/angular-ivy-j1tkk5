import { MatTableDataSource } from '@angular/material/table';
import { TableFilter } from '../dynamic-table.model';

export class FilteredDataSource<T> extends MatTableDataSource<T> {
    private _filters: TableFilter[];

    /**
     * Setter for the table filter.
     * Empty string filter is used to trigger the filtering.
     */
    set filters(filters: TableFilter[]) {
        this._filters = filters;
        this.filter = ' '; 
    }

    /**
     * Filter predicate that will use _filters to filter.
     * This is a workaround as filterPredicate interface only allows filter to be a string.
     */
     filterPredicate = (data: T): boolean => {
        let predicate = false;
        if ((!this._filters || !this._filters.length) && this.filter == ' ')
            predicate = true;
        if ( !!this.filter && this.filter != ' ' && !!this._filters && !!this._filters.length)
            predicate = this._singleFilterPredicate(data) && this._filtersPredicates(data);
        else if (!!this.filter && this.filter != ' ' )
            predicate = this._singleFilterPredicate(data);
        else if ( this.filter == ' ' && !!this._filters && !!this._filters.length)
            predicate = this._filtersPredicates(data);
        return predicate;
    }

    /**
     * Apply a single filter for the datasource in case we do a global search.
     * @param data The data to check if filter value is in its properties values.
     */
    private _singleFilterPredicate(data: T): boolean {
        return Object.keys(data).some((key) => {
            return typeof data[key] == "string" && data[key].trim().toLowerCase().includes(this.filter);
        });
    }

    /**
     * Apply mutliple filters upon datasource.
     * @param data The data to check if filters values is in its properties values.
     */
    private _filtersPredicates(data: T) {
        return this._filters.reduce((visible, tableFilter) => {
            if (!visible)
                return visible;
            const filter = tableFilter.getFilter();
            return Object.keys(filter).reduce((show, columnName) => {
                if (!show)
                    return show;
                return this.matchesFilter(filter[columnName], data[columnName]);
            }, true);
        }, true);
    }

    /**
     * Apply the filter upon the column data for every data type 
     * a filter is available for.
     * @param filterForColumn The filter to apply.
     * @param dataForColumn The data to filter.
     */
    private matchesFilter(filterForColumn: any, dataForColumn: any): boolean {
        if ( !!dataForColumn ) {
            if (filterForColumn.contains && dataForColumn.includes(filterForColumn.contains)) {
                return true;
            }
            if ( typeof(dataForColumn) == "number") {
                return this._filterNumbers(filterForColumn, dataForColumn);
            } else {
                return this._filterDates(filterForColumn, dataForColumn);
            }
        }
    }

    /**
     * Filter number data by range (min, max).
     * @param filterForColumn The filter to apply.
     * @param dataForColumn The data to filter.
     */
    private _filterNumbers(filterForColumn, dataForColumn) {
        if (filterForColumn.le && filterForColumn.ge) {  
            if (dataForColumn >= parseFloat(filterForColumn.ge) && dataForColumn <= parseFloat(filterForColumn.le)) {
                return true;
            }
        } else if (parseFloat(filterForColumn.ge) && dataForColumn >= parseFloat(filterForColumn.ge)) {
            return true;
        } else if (parseFloat(filterForColumn.le) && dataForColumn <= parseFloat(filterForColumn.le)) {
            return true;
        }
    }

    /**
     * Filter dates data by range (min, max).
     * @param filterForColumn The filter to apply.
     * @param dataForColumn The data to filter.
     */
    private _filterDates(filterForColumn, dataForColumn) {
        let dataColumnDate = new Date(dataForColumn);
        if (filterForColumn.le && filterForColumn.ge) {  
            if (dataColumnDate.getTime() >= filterForColumn.ge.getTime() && dataColumnDate.getTime() <= filterForColumn.le.getTime()) {
                return true;
            }
        } else if (filterForColumn.ge && dataColumnDate.getTime() >= filterForColumn.ge.getTime()) {
            return true;
        } else if (filterForColumn.le && dataColumnDate.getTime() <= filterForColumn.le.getTime()) {
            return true;
        }
    }
}