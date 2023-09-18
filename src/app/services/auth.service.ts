import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

import { User } from '../User';

import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean = false;
  private baseApiUrl = environment.baseApiUrl
  private apiUrl = `${this.baseApiUrl}users`

  public loggedUser$:User = { id: '', name: '' };

  constructor(private http: HttpClient) { }

  login(username: string, password: string): boolean {
    // Simulação do processo de login, pode ser personalizado conforme necessário
    if (username === 'user' && password === 'password') {
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  logout(): void {
    // Simulação do processo de logout
    this.isLoggedIn = false;
  }

  getUserInfo():Observable<User[]> {
    const idUser = '?id=1'
    const loggedUser = this.http.get<User[]>(this.apiUrl + idUser);

    loggedUser.subscribe(result => this.loggedUser$ = result[0]);

    return loggedUser;
  }

  isLoggedInUser(): boolean {
    return this.isLoggedIn;
  }

}
