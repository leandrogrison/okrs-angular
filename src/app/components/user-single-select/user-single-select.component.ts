import { Component, OnInit, Input } from '@angular/core';

import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-user-single-select',
  templateUrl: './user-single-select.component.html',
  styleUrls: ['./user-single-select.component.scss']
})
export class UserSingleSelectComponent implements OnInit {

  @Input() user!: any;
  @Input() label!: string;
  @Input() required!: boolean;
  @Input() formSubmitted!: any;

  users: User[] = []
  loading: Boolean = true
  userAutoComplete: string = ''
  delayToSearch: any = null

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  autoCompleteUser() {
    this.getUsers(this.userAutoComplete);
  }

  getUsers(value?: any) {
    clearTimeout(this.delayToSearch);
    if (typeof value === 'object') {
      this.user = value;
    } else {
      this.delayToSearch = setTimeout(() => {
        this.loading = true;
        this.usersService.getUsers(value).subscribe((data) => {
          data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.users = data;
          this.loading = false;
        })
        this.user = value;
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
