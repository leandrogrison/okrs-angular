import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { ObjectivesService } from 'src/app/services/objectives.service';
import { Objective } from 'src/app/Objective';
import { Category } from 'src/app/Category';

@Component({
  selector: 'app-objective-to-associate',
  templateUrl: './objective-to-associate.component.html',
  styleUrls: ['./objective-to-associate.component.scss']
})
export class ObjectiveToAssociateComponent implements OnInit {

  @Input() objectiveAssociate!: any;
  @Input() cycle!: Object;
  @Input() label!: string;
  @Input() hint!: string;
  @Input() category!: Category | null;
  @Input() objectiveIdEdit!: string;
  @Output() updateAssociate = new EventEmitter();

  loading: Boolean = true
  associateAutoComplete: any = ''
  delayToSearch: any = null
  categoriesToAssociate: number[] = []
  objectivesInCategories: any[] = []
  onInit: boolean = true

  constructor(private objectivesService: ObjectivesService) {}

  ngOnInit() {
    if (this.objectiveAssociate) {
      this.objectivesService.getObjectiveById(this.objectiveAssociate).subscribe((data) => {
        this.associateAutoComplete = data[0];
      });
    }
    this.getObjectives();
  }

  autoCompleteAssociate() {
    this.getObjectives(this.associateAutoComplete);
  }

  getObjectives(value?: any) {

    clearTimeout(this.delayToSearch);

    if (typeof value === 'object') {
      this.updateAssociate.emit(value.id);
    } else {
      this.delayToSearch = setTimeout(() => {
        this.loading = true;
        this.verifyCategoriesToAssociate();

        this.objectivesService.getObjectives({
          name: value,
          cycle: this.cycle,
          category: this.categoriesToAssociate,
          objectiveIdEdit: this.objectiveIdEdit
        }).subscribe((data: any) => {
          this.insertObjectivesInCategories(data);
          this.loading = false;
        })

        if (!this.onInit) this.updateAssociate.emit(value);
        this.onInit = false;

      }, 500)
    }
  }

  getCategoryById(id: number) {
    if (id === 0) return 'Objetivos de empresa';
    if (id === 1) return 'Objetivos de grupo';
    if (id === 2) return 'Objetivos individuais';
    return '';
  }

  insertObjectivesInCategories(objectives: Objective[]) {
    this.objectivesInCategories = [];

    this.categoriesToAssociate.map((category) => {
      let createCategory = true;

      objectives.map((objective) => {
        if (createCategory) {
          this.objectivesInCategories.push({
            name: this.getCategoryById(category),
            objectives: []
          })
          createCategory = false;
        }
        if (category === objective.category!.id) {
          this.objectivesInCategories[this.objectivesInCategories.length - 1].objectives.push(objective);
        }
      });

    })
  }

  verifyCategoriesToAssociate() {
    this.categoriesToAssociate = [];
    if (this.category) {
      if (this.category.id === 0) {
        this.categoriesToAssociate.push(0);
      }
      if (this.category.id === 1) {
        this.categoriesToAssociate.push(0);
        this.categoriesToAssociate.push(1);
      }
      if (this.category.id === 2) {
        this.categoriesToAssociate.push(0);
        this.categoriesToAssociate.push(1);
        this.categoriesToAssociate.push(2);
      }
    }
  }

  verifyAssociate() {
    if (typeof this.associateAutoComplete !== 'object') {
      this.associateAutoComplete = '';
      this.updateAssociate.emit(null);
      this.getObjectives();
    }
  }

  objectiveName(key: any) {
    return key ? key.name : '';
  }

  resetComponent() {
    this.associateAutoComplete = '';
    this.getObjectives();
  }

}
