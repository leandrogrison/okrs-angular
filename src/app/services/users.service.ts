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
  private apiUrl = `${this.baseApiUrl}users`

  constructor(private http: HttpClient) { }

  getUsers(name?: string): Observable<User[]> {
    const limit = '?_limit=1000';
    const order = '&_sort=name';
    const filter = name ? `&name_like=${name}` : ''
    return this.http.get<User[]>(this.apiUrl + limit + order + filter);
  }

  getUsersById(ids?: any[]): Observable<User[]> {
    const limit = '?_limit=1000';
    let filter = '';
    ids?.map((id) => {
      filter += `&id=${id}`
    })
    return this.http.get<User[]>(this.apiUrl + limit + filter);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

}
