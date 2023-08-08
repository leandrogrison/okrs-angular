import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/Category';
import { User } from 'src/app/User';
import { Objective } from 'src/app/Objective';

import { CycleSelectComponent } from './../cycle-select/cycle-select.component';
import { UserSingleSelectComponent } from '../user-single-select/user-single-select.component';
import { ObjectiveToAssociateComponent } from '../objective-to-associate/objective-to-associate.component';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrls: ['./objective-form.component.css']
})
export class ObjectiveFormComponent implements OnInit {

  @Output() onSubmit = new EventEmitter<Objective>()

  @ViewChild('formObjective') formObjective!: any;
  @ViewChild('buttonSubmitHidden') buttonSubmitHidden!: ElementRef<HTMLElement>;
  @ViewChild(CycleSelectComponent) cycleSelect!: CycleSelectComponent;
  @ViewChild(ObjectiveToAssociateComponent) objectiveToAssociate!: ObjectiveToAssociateComponent;
  @ViewChild(UserSingleSelectComponent) userSingleSelect!: UserSingleSelectComponent;

  categories: Category[] = []
  ownerMe: User = { id: -1, name: '', photo: '' }
  loading: boolean =  false

  objective: Objective = {
    id: uuidv4(),
    name: '',
    description: '',
    category: null,
    owner: null,
    supporters: [],
    visibility: 'public',
    cycle: {
      id: '',
      name: ''
    },
    createdAt: new Date(),
    startDate: '',
    deadline: '',
    finished: 0,
    associate: null
  }

  constructor(
    private categoriesService: CategoriesService,
    private authService: AuthService
  ) {
    this.ownerMe = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.categories = this.categoriesService.setCategories();
  }

  ngAfterViewInit() {
    this.setDates();
  }

  setDates() {
    if (!this.cycleSelect) return;

    const year = parseFloat(this.objective.cycle.id.substring(0, 4));
    const quarter = parseFloat(this.objective.cycle.id.substring(5));
    const month = this.cycleSelect.getMonthInQuarter(quarter);
    const deadline = new Date(year, month + 2, 0);

    this.objective.startDate = year + '-' + ('0' + month).slice(-2) + '-01';
    this.objective.deadline = deadline.toISOString().split('T')[0];
  }

  updateCycleHandler(cycle: any) {
    this.objective.cycle = cycle;
    this.objective.associate = null;
    this.setDates();
    setTimeout(() => {
      this.objectiveToAssociate.resetComponent();
    }, 100);
  }

  updateAssociateHandler(objectiveId: string) {
    this.objective.associate = objectiveId;
  }

  updateOwnerHandler(owner: any) {
    this.objective.owner = owner;
  }

  updateSupportersHandler(supporters: any) {
    this.objective.supporters = supporters;
  }

  setOwnerMe(event: any) {
    if (event.checked) {
      this.updateOwnerHandler(this.ownerMe);
      this.userSingleSelect.autoCompleteUserExternal(this.ownerMe);
    } else {
      this.updateOwnerHandler(undefined);
      this.userSingleSelect.autoCompleteUserExternal(undefined);
    }
  }

  saveOjectiveButton() {
    this.buttonSubmitHidden.nativeElement.click();
  }

  saveObjective() {
    if (this.formObjective.invalid) return;

    this.onSubmit.emit(this.objective);
  }
}
