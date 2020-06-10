import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnConfig } from './shared/components/dae-dynamic-table/column-config.model';
import { of } from 'rxjs/observable/of';

@Injectable()
export class DataService {

  constructor() { }

  getData(): Observable<any[]> {
    return of([
      {
        firstName: "John",
        lastName: "Doe",
        birthDate: "1987-06-02T00:00:00.000Z",
        children: 0
      },
      {
        firstName: "Mike",
        lastName: "Penn",
        birthDate: "1959-01-23T00:00:00.000Z",
        children: 2
      }
    ]);
  }

  getDataSchemaColumns(): Observable<ColumnConfig[]> {
    return of([
      {
        _class: "string",
        name: "firstName",
        description: "Prénom",
        required: true
      },
      {
        _class: "string",
        name: "lastName",
        description: "Nom",
        required: true
      },
      {
        _class: "date",
        name: "birthDate",
        description: "Date de naissance",
        required: true
      },
      {
        _class: "number",
        name: "children",
        description: "Nombre d'enfants",
        required: true
      }
    ]);
  }


}
