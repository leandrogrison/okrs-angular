import { Injectable } from '@angular/core';

import { User } from '../User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean = false;

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

  getUserInfo(): User {
    // Retorna informações do usuário simuladas (pode ser um objeto com mais informações)
    return {
      id: 1,
      name: "Maurício Ribeiro Andrade",
      photo: "https://randomuser.me/api/portraits/men/89.jpg"
    };
  }

  isLoggedInUser(): boolean {
    return this.isLoggedIn;
  }
}
