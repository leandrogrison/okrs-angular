import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

import { Cycle } from 'src/app/Cycle';
import { User } from 'src/app/User';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() filter: any = {};
  @Input() cycles: Cycle[] = [];
  @Output() filterChange = new EventEmitter();
  @Output() handleGetObjectives = new EventEmitter();

  openedFilters: boolean = false;
  ownerMe: User = { id: '', name: '', photo: '' }

  constructor(private authService: AuthService) {
    this.ownerMe = this.authService.loggedUser$;
  }

  filterObjectives() {
    this.handleGetObjectives.emit();
  }

  filterCategory(category: any) {
    if (this.filter.category.includes(category)) {
      this.filter.category = this.filter.category.filter((cat: any) => {
        return cat !== category
      });
    } else {
      this.filter.category.push(category);
    }

    this.filterObjectives();
  }

  filterOwner(owner: boolean) {
    if (owner) {
      this.filter.owner = this.ownerMe.id;
    } else {
      this.filter.owner = null;
    }

    this.filterObjectives();
  }

  filterSupporter(supporter: boolean) {
    if (supporter) {
      this.filter.supporter = this.ownerMe.id;
    } else {
      this.filter.supporter = null;
    }

    this.filterObjectives();
  }

  openFilters() {
    this.openedFilters = !this.openedFilters;
  }
}
