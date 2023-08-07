import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

import { Cycle } from '../Cycle';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CyclesService {
  private baseApiUrl = environment.baseApiUrl
  private apiUrl = `${this.baseApiUrl}cycles`

  constructor(private http: HttpClient) { }

  getCycles(filter?: Cycle): Observable<Cycle[]> {
    const order = '?_sort=id&_order=desc';
    const stringToFilter = filter ? '&id=' + filter : '';

    return this.http.get<Cycle[]>(this.apiUrl + order + stringToFilter);
  }

  createCycle(cycle: Cycle): Observable<Cycle> {
    return this.http.post<Cycle>(this.apiUrl, cycle);
  }
}
