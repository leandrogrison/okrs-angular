import { Component, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { ObjectiveFormComponent } from '../objective-form/objective-form.component';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-create-objective',
  templateUrl: './create-objective.component.html',
  styleUrls: ['./create-objective.component.scss']
})
export class CreateObjectiveComponent implements OnInit {

  @ViewChild(ObjectiveFormComponent) objectiveForm!: ObjectiveFormComponent;

  @Output() submitCreateObjective = new EventEmitter();

  ngOnInit(): void {}

  constructor() {}

  async createObjectiveHandler(objective: Objective) {
    console.log(objective)
  }

  createObjective() {
    this.objectiveForm.saveOjectiveButton();
  }


}
