import { Component, OnInit, Input, Output, EventEmitter, inject, ViewChild, ElementRef } from '@angular/core';
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

  @Input() users: any[] = [];
  @Input() label!: string;
  @Output() updateSupporters = new EventEmitter();

  usersToSelect: User[] = []
  usersSelected: User[] = []
  loading: boolean = true
  userAutoComplete: string = ''
  delayToSearch: any = null

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  announcer = inject(LiveAnnouncer);

  @ViewChild('usersField') usersField!: ElementRef;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    if (this.users && this.users.length > 0) {
      this.getUsersOnInit();
    } else {
      this.getUsers();
    }
  }

  autoCompleteUser() {
    this.getUsers(this.userAutoComplete);
  }

  getUsersOnInit() {
    this.usersService.getUsersById(this.users).subscribe((data) => {
      this.usersSelected = this.sortUsers(data);
      this.getUsers();
    })
  }

  sortUsers(users: User[]) {
    users.sort((a,b) => {
      if (a.name > b.name) return 1;
      if (b.name > a.name) return -1;
      return 0;
    });

    return users;
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
        const usersFiltred = this.sortAndFilterUsers(data);
        this.usersToSelect = (this.usersSelected && this.usersSelected.length > 0) ? usersFiltred : data;
        this.loading = false;
      })
    }, 500)
  }

  sortAndFilterUsers(users: User[]): User[] {
    let usersSorted: User[] = this.sortUsers(users);
    return usersSorted.filter(
      item => this.usersSelected?.every(
        user => user.id !== item.id
      )
    );
  }

  clearUser() {
    this.usersField.nativeElement.value = '';
    this.userAutoComplete = '';
  }

  removeUser(user: User): void {
    const index = this.usersSelected.indexOf(user);

    if (index >= 0) {
      this.usersSelected.splice(index, 1);
      this.usersToSelect.unshift(user);
      this.usersToSelect = this.sortUsers(this.usersToSelect);
      this.announcer.announce(`Removido ${user.name}`);
      this.updateSupporters.emit(this.usersSelected);
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    this.usersSelected.push(event.option.value);
    this.updateSupporters.emit(this.usersSelected);
  }

}
