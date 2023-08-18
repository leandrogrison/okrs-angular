import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

import { KR } from '../KR';
import { Objective } from '../Objective';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class KrsService {
  private baseApiUrl = environment.baseApiUrl
  private apiUrl = `${this.baseApiUrl}krs`

  constructor(private http: HttpClient) { }

  getKrs(objective?: Objective): Observable<KR[]> {
    const limit = '?_limit=1000';
    const idObjective = objective ? `&objective=${objective.id}` : '';
    const url = this.apiUrl + limit + idObjective;

    return this.http.get<KR[]>(url);
  }

  createKr(kr: KR): Observable<KR> {
    return this.http.post<KR>(this.apiUrl, kr);
  }
}
