import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('formLogin') formLogin!: any;

  username: string = '';
  password: string = '';

  serverActived: boolean = false;
  serverError: string = '';
  isLoading: boolean = false;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.verifyServerIsActive();
  }

  verifyServerIsActive() {
    this.usersService.getUsersById(['admin']).subscribe({
      next: () => {
        this.serverActived = true;
      },
      error: () => {
        if (environment.isProduction) {
          this.serverError = 'Erro ao acessar API, tente novamente mais tarde.'
        } else {
          this.serverError = 'Erro ao acessar API localmente, verifique se a execução do comando npm run backend ocorreu com sucesso.'
        }
      }
    })
  }

  login() {

    if (this.formLogin.invalid) return;

    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (result) => {
        if (result.length) {
          this.router.navigate(['']);
        } else {
          this.serverError = 'Usuário ou senha inválidos, tente novamente.'
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.serverError = 'Erro ao conectar com o servidor, tente novamente.'
        console.log(error);
        this.isLoading = false;
      }
    });

  }

}
