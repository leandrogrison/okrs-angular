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

  @Input() objectiveAssociate!: Object;
  @Input() cycle!: Object;
  @Input() label!: string;
  @Input() hint!: string;
  @Input() category!: Category | null;
  @Output() updateAssociate = new EventEmitter();

  objectives: Objective[] = []
  loading: Boolean = true
  associateAutoComplete: string = ''
  delayToSearch: any = null
  categoriesToAssociate: number[] = []

  constructor(private objectivesService: ObjectivesService) {}

  ngOnInit(): void {
    this.getObjectives();
  }

  autoCompleteAssociate() {
    this.getObjectives(this.associateAutoComplete);
  }

  getObjectives(value?: any) {

    clearTimeout(this.delayToSearch);

    if (typeof value === 'object') {
      this.objectiveAssociate = value.id;
      this.updateAssociate.emit(value.id);
    } else {
      this.delayToSearch = setTimeout(() => {
        this.loading = true;
        this.verifyCategoriesToAssociate();

        this.objectivesService.getObjectives({
          name: value,
          cycle: this.cycle,
          category: this.categoriesToAssociate
        }).subscribe((data: any) => {
          this.objectives = data;
          this.loading = false;
        })

        this.objectiveAssociate = value;
      }, 500)
    }
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
