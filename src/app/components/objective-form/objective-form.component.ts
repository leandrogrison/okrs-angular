import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { CategoriesService } from 'src/app/services/categories.service';
import { Categorie } from 'src/app/Categorie';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/User';

import { ObjectivesService } from 'src/app/services/objectives.service';
import { Objective } from 'src/app/Objective';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrls: ['./objective-form.component.css']
})
export class ObjectiveFormComponent implements OnInit {

  categories: Categorie[] = []
  usersToOwner: User[] = []
  usersToSupporter: User[] = []
  objectivesToAssociate: Objective[] = []

  loadingUsersToOwner: Boolean = true
  loadingUsersToSupporter: Boolean = true
  loadingObjectivesToAssociate: Boolean = true

  ownerAutoComplete: string = ''
  supporterAutoComplete: string = ''
  associateAutoComplete: string = ''

  delayToSearchOwner: any = null
  delayToSearchSupporter: any = null
  delayToSearchAssociate: any = null

  readonly separatorKeysCodesSupporters = [ENTER, COMMA] as const;
  announcerSupporters = inject(LiveAnnouncer);

  objective: Objective = {
    name: '',
    description: '',
    category: {
      id: -1,
      name: ''
    },
    owner: {
      id: -1,
      name: '',
      photo: ''
    },
    supporters: [],
    visibility: 'public',
    cycle: {
      id: '',
      name: ''
    },
    startDate: '',
    deadline: '',
    finished: 0
  }

  @ViewChild('supporterField') supporterField!: ElementRef;

  constructor(
    private categoriesService: CategoriesService,
    private usersService: UsersService,
    private objectivesService: ObjectivesService
  ) {}

  ngOnInit(): void {
    this.categories = this.categoriesService.setCategories();
    this.getUsersToOwner();
    this.getUsersToSupporters();
    this.getObjectivesToAssociate();
  }

  autoCompleteOwner() {
    this.getUsersToOwner(this.ownerAutoComplete);
  }

  getUsersToOwner(value?: any) {
    clearTimeout(this.delayToSearchOwner);
    if (typeof value === 'object') {
      this.objective.owner = value;
    } else {
      this.delayToSearchOwner = setTimeout(() => {
        this.loadingUsersToOwner = true;
        this.usersService.getUsers(value).subscribe((data) => {
          data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.usersToOwner = data;
          this.loadingUsersToOwner = false;
        })
        this.objective.owner = value;
      }, 500)
    }
  }

  autoCompleteSupporter() {
    this.getUsersToSupporters(this.supporterAutoComplete);
  }

  getUsersToSupporters(value?: any) {
    clearTimeout(this.delayToSearchSupporter);
    if (typeof value === 'object') {
      this.supporterField.nativeElement.value = '';
      this.supporterAutoComplete = '';
    }
    this.delayToSearchSupporter = setTimeout(() => {
      this.loadingUsersToSupporter = true;
      this.usersService.getUsers(value).subscribe((data) => {
        data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        const usersFiltred = data.filter(
          item => this.objective.supporters?.every(
            supporter => supporter.id !== item.id
          )
        );
        this.usersToSupporter = (this.objective.supporters && this.objective.supporters.length > 0) ? usersFiltred : data;
        this.loadingUsersToSupporter = false;
      })
    }, 500)
  }

  verifyOwner() {
    if (typeof this.ownerAutoComplete !== 'object') {
      this.ownerAutoComplete = '';
      this.getUsersToOwner();
    }
  }

  userName (key: any) {
    return key ? key.name : '';
  }

  clearSupporter() {
    this.supporterField.nativeElement.value = '';
    this.supporterAutoComplete = '';
  }

  removeSupporter(user: User): void {
    const index = this.objective.supporters!.indexOf(user);

    if (index >= 0) {
      this.objective.supporters!.splice(index, 1);
      this.usersToSupporter.unshift(user);
      this.usersToSupporter.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.announcerSupporters.announce(`Removido ${user}`);
    }
  }

  selectedSupporter(event: MatAutocompleteSelectedEvent): void {
    this.objective.supporters!.push(event.option.value);
  }

  autoCompleteAssociate() {
    this.getObjectivesToAssociate(this.associateAutoComplete);
  }

  getObjectivesToAssociate(value?: any) {
    clearTimeout(this.delayToSearchAssociate);
    if (typeof value === 'object') {
      this.objective.associate = value;
    } else {
      this.delayToSearchAssociate = setTimeout(() => {
        this.loadingObjectivesToAssociate = true;
        this.objectivesService.getObjectives(value).subscribe((data) => {
          this.objectivesToAssociate = data;
          this.loadingObjectivesToAssociate = false;
        })
        this.objective.associate = value;
      }, 500)
    }
  }

  verifyAssociate() {
    if (typeof this.associateAutoComplete !== 'object') {
      this.associateAutoComplete = '';
      this.getObjectivesToAssociate();
    }
  }

  objectiveName (key: any) {
    return key ? key.name : '';
  }
}
