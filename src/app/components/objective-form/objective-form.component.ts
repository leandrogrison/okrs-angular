import { Component, OnInit } from '@angular/core';

import { CategoriesService } from 'src/app/services/categories.service';
import { Categorie } from 'src/app/Categorie';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrls: ['./objective-form.component.css']
})
export class ObjectiveFormComponent implements OnInit {

  categories: Categorie[] = []

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
    finished: 0,
    associate: {
      id: '',
      name: ''
    }
  }

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categories = this.categoriesService.setCategories();
  }

  updateCycleHandler(cycle: any) {
    this.objective.cycle = cycle;
  }
}
