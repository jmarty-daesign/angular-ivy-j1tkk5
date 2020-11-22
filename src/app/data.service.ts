import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { ColumnConfig } from './shared/components/dae-dynamic-table/dynamic-table.model';

@Injectable()
export class DataService {

  constructor() { }

  getData(): Observable<any[]> {
    return of([
      {
        _id: "zeofhz3FEOcfha",
        firstName: "John",
        lastName: "Doe",
        birthDate: "1987-06-02T00:00:00.000Z",
        children: 0
      },
      {
        _id: "zeofzd42DOcFhu",
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
        type: "string",
        tag: "_id",
        localname: "ID",
        required: true,
        visible: 2,
        mode: 5
      },
      {
        type: "string",
        tag: "firstName",
        localname: "Prénom",
        required: true,
        visible: 2,
        mode: 5
      },
      {
        type: "string",
        tag: "lastName",
        localname: "Nom",
        required: true,
        visible: 2,
        mode: 5
      },
      {
        type: "date",
        tag: "birthDate",
        localname: "Date de naissance",
        required: true,
        visible: 2,
        mode: 5
      },
      {
        type: "number",
        tag: "children",
        localname: "Nombre d'enfants",
        required: true,
        visible: 2,
        mode: 5
      }
    ]);
  }

  getDataToAdd(): Observable<any[]> {
    return of([
      {
        _id: "zeofhzDDzzOcfha",
        firstName: "Jim",
        lastName: "Doe",
        birthDate: "1981-10-22T00:00:00.000Z",
        children: 12
      },
      {
        _id: "ze524562DOcFhu",
        firstName: "Nigel",
        lastName: "Flint",
        birthDate: "1945-12-22T00:00:00.000Z",
        children: 89
      }
    ]);
  }


}
