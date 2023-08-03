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

  getObjectives(name?: string): Observable<Objective[]> {
    const limit = '?_limit=1000';
    const filter = name ? `&name_like=${name}` : '';
    return this.http.get<Objective[]>(this.apiUrl + limit + filter);
  }

  createObjective(objective: Objective): Observable<Objective> {
    return this.http.post<Objective>(this.apiUrl, objective);
  }

}
