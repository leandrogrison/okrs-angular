import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

import { Objective } from '../Objective';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ObjectivesService {
  private baseApiUrl = environment.baseApiUrl
  private apiUrl = `${this.baseApiUrl}objectives`

  constructor(private http: HttpClient) { }

  createStringToFilter(filter: any): string {
    let result = '';

    result = filter.search ? `&q=${filter.search}` : '';

    if (filter.category && filter.category.length) {
      filter.category.map((category: any) => {
        result += `&category.id=${category}`;
      })
    }

    result += filter.owner ? `&owner.id=${filter.owner}` : '';

    console.log(result)

    return result;
  }

  getObjectives(filter?: object): Observable<Objective[]> {
    const limit = '?_limit=1000';
    const order = '&_sort=createdAt&_order=desc';
    const stringToFilter = filter ? this.createStringToFilter(filter) : '';

    return this.http.get<Objective[]>(this.apiUrl + limit + order + stringToFilter);
  }

  createObjective(objective: Objective): Observable<Objective> {
    return this.http.post<Objective>(this.apiUrl, objective);
  }

}
