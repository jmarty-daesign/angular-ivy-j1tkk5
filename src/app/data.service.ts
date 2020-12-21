import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { ColumnConfig, IDictionary, IMap } from './shared/components/dae-dynamic-table/dynamic-table.model';

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
        children: 0,
        skills: [
          {
            _id: "1",
            name: "HTML5"
          },
          {
            _id: "2",
            name: "CSS3"
          }
        ],
        gender: "84JFKJ3UF"
      },
      {
        _id: "zeofzd42DOcFhu",
        firstName: "Mike",
        lastName: "Penn",
        birthDate: "1959-01-23T00:00:00.000Z",
        children: 2,
        skills: [
          {
            _id: "1",
            name: "HTML5"
          },
          {
            _id: "2",
            name: "CSS3"
          }
        ],
        gender: "84JFKJ3UF"
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
        mode: 3
      },
      {
        type: "string",
        tag: "lastName",
        localname: "Nom",
        required: true,
        visible: 2,
        mode: 3
      },
      {
        type: "date",
        tag: "birthDate",
        localname: "Date de naissance",
        required: true,
        visible: 2,
        mode: 3
      },
      {
        type: "number",
        tag: "children",
        localname: "Nombre d'enfants",
        required: true,
        visible: 2,
        mode: 3
      },
      {
        type: "array",
        tag: "skills",
        localname: "Compétences",
        ref: "name",
        required: true,
        visible: 2,
        mode: 3
      },
      {
        type: "list",
        tag: "gender",
        localname: "Sexe",
        required: true,
        visible: 2,
        mode: 3
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
        children: 12,
        gender: "84JFKJ3UF"
      },
      {
        _id: "ze524562DOcFhu",
        firstName: "Nigel",
        lastName: "Flint",
        birthDate: "1945-12-22T00:00:00.000Z",
        children: 89,
        gender: "84JFKJ3UF"
      }
    ]);
  }

  getGendersList(): Observable<IDictionary<IMap[]>> {
    return of({ gender : [
      {
        key: "zefpoko843KF",
        value: "Féminin"
      },
      {
        key: "84JFKJ3UF",
        value: "Masculin"
      }
    ]
  });
  }


}
