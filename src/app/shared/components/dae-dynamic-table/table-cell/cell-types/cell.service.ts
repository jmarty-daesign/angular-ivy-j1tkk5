import { Type } from '@angular/core';
import { TextCellComponent } from './text-cell.component';

export class CellService {

    private registeredCells: { [key: string]: Type<any>; } = {};
    
    /**
     * Register a cell component for a given data type.
     * @param type The data type to register the component for.
     * @param component The component handling the cell display.
     */
    registerCell(type: string, component: Type<any>) {
        this.registeredCells[type] = component;
    }

    /**
     * Retrieve the component handling a given data type cell display.
     * @param type The data type to get the component for.
     */
    getCell(type: string): Type<any> {
        const component = this.registeredCells[type];
        if (component == null)
            return TextCellComponent;
        return component;
    }
}