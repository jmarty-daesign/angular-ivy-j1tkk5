import { Type } from '@angular/core';

export class ColumnFilterService {

    private registeredFilters: { [key: string]: Type<any>; } = {};
    
    /**
     * Register a filter for a given data type.
     * @param type The data type to register the filter for.
     * @param component The component to handle filter.
     */
    registerFilter(type: string, component: Type<any>) {
        this.registeredFilters[type] = component;
    }

    /**
     * Retrieve a filter component for a given data type.
     * @param type The data type to get the filter component for.
     */
    getFilter(type: string): Type<any> {
        const component = this.registeredFilters[type];
        return component;
    }
}