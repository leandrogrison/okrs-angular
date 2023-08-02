import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

import { CategoriesService } from 'src/app/services/categories.service';
import { Categorie } from 'src/app/Categorie';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrls: ['./objective-form.component.css']
})
export class ObjectiveFormComponent implements OnInit {

  @Output() onSubmit = new EventEmitter<Objective>()

  @ViewChild('formObjective') formObjective!: any;
  @ViewChild('buttonSubmitHidden') buttonSubmitHidden!: ElementRef<HTMLElement>;

  categories: Categorie[] = []

  objective: Objective = {
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

  updateCycleHandler(cycle: any) {
    this.objective.cycle = cycle;
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
