import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

import { KR } from '../KR';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class KrsService {
  private baseApiUrl = environment.baseApiUrl
  private apiUrl = `${this.baseApiUrl}krs`

  constructor(private http: HttpClient) { }

  createKr(kr: KR): Observable<KR> {
    return this.http.post<KR>(this.apiUrl, kr);
  }
}
