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
  private apiUrl = `${this.baseApiUrl}objectives?_limit=1000`

  constructor(private http: HttpClient) { }

  getObjectives(name?: string): Observable<Objective[]> {
    const filter = name ? `&name_like=${name}` : ''
    return this.http.get<Objective[]>(this.apiUrl + filter);
  }

}
