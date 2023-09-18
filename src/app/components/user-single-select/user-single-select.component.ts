import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-user-single-select',
  templateUrl: './user-single-select.component.html',
  styleUrls: ['./user-single-select.component.scss']
})
export class UserSingleSelectComponent implements OnInit {

  @Input() user!: string | null;
  @Input() label!: string;
  @Input() required!: boolean;
  @Output() updateOwner = new EventEmitter();

  users: User[] = [];
  loading: Boolean = true;
  userAutoComplete: any = '';
  delayToSearch: any = null;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    if (this.user) {
      this.getUserOnInit();
    } else {
      this.getUsers();
    }
  }

  getUserOnInit() {
    this.usersService.getUsersById([this.user]).subscribe((result) => {
      this.userAutoComplete = result[0];
      this.usersService.getUsers(this.userAutoComplete.name).subscribe((data) => {
        data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.users = data;
        this.loading = false;
      })
    })
  }

  autoCompleteUser() {
    this.getUsers(this.userAutoComplete);
  }

  autoCompleteUserExternal(value?: any) {
    this.userAutoComplete = value;

    this.autoCompleteUser();
  }

  getUsers(value?: any) {
    clearTimeout(this.delayToSearch);
    if (typeof value === 'object') {
      this.updateOwner.emit(value);
    } else {
      this.delayToSearch = setTimeout(() => {
        this.loading = true;
        this.usersService.getUsers(value).subscribe((data) => {
          data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.users = data;
          this.loading = false;
        })
        this.updateOwner.emit(value);
      }, 500)
    }
  }

  verifyUser() {
    if (typeof this.userAutoComplete !== 'object') {
      this.userAutoComplete = '';
      this.getUsers();
    }
  }

  userName (key: any) {
    return key ? key.name : '';
  }

}
