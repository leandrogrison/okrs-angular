import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/User';

import { UsersService } from 'src/app/services/users.service';
import { MessagesService } from 'src/app/services/messages.service';

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

  constructor(private usersService: UsersService, private messagesService: MessagesService) {}

  ngOnInit(): void {
    this.getUsers();
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
