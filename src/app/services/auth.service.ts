import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '../User';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseApiUrl = environment.baseApiUrl
  private apiUrl = `${this.baseApiUrl}users`

  public loggedUser$:User = { id: '', name: '' };

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<any> {
    const data = `?email=${username}&password=${password}`;
    const loggedUser = this.http.get<User[]>(this.apiUrl + data);

    loggedUser.subscribe({
      next: (result) => {
        this.loggedUser$ = result[0];
        localStorage.setItem('tokenUser', btoa(JSON.stringify("TokenQueSeriaGeradoPelaAPI")));
        localStorage.setItem('loggedUser', btoa(JSON.stringify(this.loggedUser$)));
      },
      error: (error) => {
        console.log(error);
      }
    });

    return loggedUser;
  }

  logout(): void {
    localStorage.removeItem('tokenUser');
    this.loggedUser$ = { id: '', name: '' };
    this.router.navigate(['/login']);
  }

  getUserInfo(id: string):Observable<User[]> {
    const idUser = '?id=' + id;
    const loggedUser = this.http.get<User[]>(this.apiUrl + idUser);

    loggedUser.subscribe(result => this.loggedUser$ = result[0]);

    return loggedUser;
  }

  get logged(): boolean {
    const tokenInLocalStorage = localStorage.getItem('tokenUser');
    const userLoggedInLocalStorage = localStorage.getItem('loggedUser');
    const withToken = tokenInLocalStorage && tokenInLocalStorage.length > 0;

    if (withToken && userLoggedInLocalStorage) {
      if (atob(userLoggedInLocalStorage) !== typeof undefined) {
        this.loggedUser$ = JSON.parse(atob(userLoggedInLocalStorage));
        return true;
      }
    }

    return false;
  }

  get getTokenUser(): string {
    const tokenLogged = localStorage.getItem('tokenUser');

    if (tokenLogged) {
      return JSON.parse(atob(tokenLogged));
    }

    return ''
  }

}
