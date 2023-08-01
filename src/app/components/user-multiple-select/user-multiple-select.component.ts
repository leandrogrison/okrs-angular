import { Component, OnInit, Input, inject, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-user-multiple-select',
  templateUrl: './user-multiple-select.component.html',
  styleUrls: ['./user-multiple-select.component.scss']
})
export class UserMultipleSelectComponent implements OnInit {

  @Input() users: User[] = [];
  @Input() label!: string;

  usersToSelect: User[] = []
  loading: Boolean = true
  userAutoComplete: string = ''
  delayToSearch: any = null

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  announcer = inject(LiveAnnouncer);

  @ViewChild('usersField') usersField!: ElementRef;

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
      this.usersField.nativeElement.value = '';
      this.userAutoComplete = '';
    }
    this.delayToSearch = setTimeout(() => {
      this.loading = true;
      this.usersService.getUsers(value).subscribe((data) => {
        data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        const usersFiltred = data.filter(
          item => this.users?.every(
            user => user.id !== item.id
          )
        );
        this.usersToSelect = (this.users && this.users.length > 0) ? usersFiltred : data;
        this.loading = false;
      })
    }, 500)
  }

  clearUser() {
    this.usersField.nativeElement.value = '';
    this.userAutoComplete = '';
  }

  removeUser(user: User): void {
    const index = this.users!.indexOf(user);

    if (index >= 0) {
      this.users!.splice(index, 1);
      this.usersToSelect.unshift(user);
      this.usersToSelect.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.announcer.announce(`Removido ${user}`);
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    this.users!.push(event.option.value);
  }

}
