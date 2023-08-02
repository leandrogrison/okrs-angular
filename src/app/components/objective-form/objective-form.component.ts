import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { CategoriesService } from 'src/app/services/categories.service';
import { Categorie } from 'src/app/Categorie';

import { Objective } from 'src/app/Objective';

import { CycleSelectComponent } from './../cycle-select/cycle-select.component';

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

  categories: Categorie[] = []

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
    startDate: '',
    deadline: '',
    finished: 0,
    associate: null
  }

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categories = this.categoriesService.setCategories();
  }

  ngAfterViewInit() {
    this.setDates();
  }

  setDates() {
    if (!this.cycleSelect) return;

    const quarter = parseFloat(this.objective.cycle.id.substring(0, 1));
    const year = parseFloat(this.objective.cycle.id.substring(2));
    const month = this.cycleSelect.getMonthInQuarter(quarter);
    const deadline = new Date(year, month + 2, 0);

    this.objective.startDate = year + '-' + ('0' + month).slice(-2) + '-01';
    this.objective.deadline = deadline.toISOString().split('T')[0];
  }

  updateCycleHandler(cycle: any) {
    this.objective.cycle = cycle;
    this.setDates();
  }

  updateOwnerHandler(owner: any) {
    this.objective.owner = owner;
  }

  updateSupportersHandler(supporters: any) {
    this.objective.supporters = supporters;
  }

  saveOjectiveButton() {
    this.buttonSubmitHidden.nativeElement.click()
  }

  saveObjective() {

    if (this.formObjective.invalid) return;

    this.onSubmit.emit(this.objective);
  }
}
