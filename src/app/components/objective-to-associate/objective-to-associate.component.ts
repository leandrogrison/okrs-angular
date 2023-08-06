import { Component, Input, OnInit } from '@angular/core';

import { ObjectivesService } from 'src/app/services/objectives.service';
import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-to-associate',
  templateUrl: './objective-to-associate.component.html',
  styleUrls: ['./objective-to-associate.component.scss']
})
export class ObjectiveToAssociateComponent implements OnInit {

  @Input() objectiveAssociate!: Object;
  @Input() label!: string;
  @Input() hint!: string;

  objectives: Objective[] = []
  loading: Boolean = true
  associateAutoComplete: string = ''
  delayToSearch: any = null

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
      this.objectiveAssociate = value;
    } else {
      this.delayToSearch = setTimeout(() => {
        this.loading = true;
        this.objectivesService.getObjectives({name: value}).subscribe((data) => {
          this.objectives = data;
          this.loading = false;
        })
        this.objectiveAssociate = value;
      }, 500)
    }
  }

  verifyAssociate() {
    if (typeof this.associateAutoComplete !== 'object') {
      this.associateAutoComplete = '';
      this.getObjectives();
    }
  }

  objectiveName (key: any) {
    return key ? key.name : '';
  }

}
