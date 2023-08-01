import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

import { User } from '../User';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseApiUrl = environment.baseApiUrl
  private apiUrl = `${this.baseApiUrl}users?_limit=100`

  constructor(private http: HttpClient) { }

  getUsers(name?: string): Observable<User[]> {
    const filter = name ? `&name_like=${name}` : ''
    return this.http.get<User[]>(this.apiUrl + filter);
  }

}
