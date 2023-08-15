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
  loading: Boolean = true
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
      this.usersSelected = data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.getUsers();
    })
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
    users.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    return users.filter(
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
    const index = this.usersSelected!.indexOf(user);

    if (index >= 0) {
      this.usersSelected!.splice(index, 1);
      this.usersToSelect.unshift(user);
      this.usersToSelect.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.announcer.announce(`Removido ${user}`);
      this.updateSupporters.emit(this.usersSelected);
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    this.usersSelected.push(event.option.value);
    this.updateSupporters.emit(this.usersSelected);
  }

}
