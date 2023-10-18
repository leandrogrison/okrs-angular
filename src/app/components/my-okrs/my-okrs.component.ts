import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

import { KR } from 'src/app/KR';
import { Objective } from 'src/app/Objective';
import { User } from 'src/app/User';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-okrs',
  templateUrl: './my-okrs.component.html',
  styleUrls: ['./my-okrs.component.scss']
})
export class MyOkrsComponent implements OnInit {

  @Input() objectives:Objective[] = [];
  @Input() myKrs:KR[] = [];
  @Input() filter = {
    cycle: {
      id: `${new Date().getFullYear()}Q${this.quarterPipe.transform(new Date())}`,
      name: `${this.quarterPipe.transform(new Date())}° Trimestre ${new Date().getFullYear()}`
    }
  }
  @Output() updateObjectivesHandle = new EventEmitter();

  myObjectives: Objective[] = [];
  ownerMe: User = { id: '', name: '' }
  objectivesWithMyKRs: Objective[] = [];

  constructor(
    private quarterPipe: QuarterPipe,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.ownerMe = this.authService.loggedUser$;
    this.getMyObjectives();
    this.getObjectivesWithMyKRs();
  }

  getMyObjectives() {
    this.myObjectives = this.objectives.filter(objective =>
      objective.owner === this.ownerMe.id &&
      objective.cycle.id === this.filter.cycle.id
    );
  }

  getObjectivesWithMyKRs() {
    const objectivesDiff =
      this.objectives.filter(({id: objective}) =>
      !this.myObjectives.some(({id: myObjective}) =>
      myObjective === objective));

    objectivesDiff.forEach(objective => {
      if (objective.cycle.id === this.filter.cycle.id) {
        this.myKrs.forEach(kr => {
          if (kr.objective ===  objective.id ) {
            this.objectivesWithMyKRs.push(objective);
          }
        })
      }
    })
  }

  updateObjectives(event: any) {
    this.updateObjectivesHandle.emit(event);
  }

}
