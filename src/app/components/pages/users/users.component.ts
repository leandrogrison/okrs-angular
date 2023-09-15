import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateUserComponent } from '../../create-user/create-user.component';

import { User } from 'src/app/User';

import { UsersService } from 'src/app/services/users.service';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  loading: boolean = true;
  users: User[] = [];
  keyword: string = '';
  delayToSearch: any = null;
  myUser!: User;

  constructor(
    private usersService: UsersService,
    private messagesService: MessagesService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.myUser = this.authService.getUserInfo();
  }

  getUsers(keyword?: string) {
    this.loading = true;
    this.usersService.getUsers(keyword).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao buscar usuários! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  openCreateUser() {
    this.dialog.open(CreateUserComponent, {
      maxWidth: 900,
      width: 'calc(100% - 32px)',
      panelClass: 'dialog-container-component',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result && result.id) this.getUsers();
    });
  }

  changeSearchKeyword() {
    clearTimeout(this.delayToSearch);

    this.delayToSearch = setTimeout(() => {
      this.getUsers(this.keyword);
    }, 500);

  }

  clearSearchKeyword() {
    this.keyword = '';
    this.getUsers();
  }

}
