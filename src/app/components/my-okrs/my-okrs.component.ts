import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

import { KR } from 'src/app/KR';
import { Objective } from 'src/app/Objective';

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
  objectivesWithMyKRs: Objective[] = [];

  constructor(
    private quarterPipe: QuarterPipe,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getMyObjectives();
    this.getObjectivesWithMyKRs();
  }

  getMyObjectives() {
    this.myObjectives = this.objectives.filter(objective =>
      objective.owner!.id === this.authService.getUserInfo().id &&
      objective.cycle.id === this.filter.cycle.id
    );
  }

  getObjectivesWithMyKRs() {
    const objectivesDiff =
      this.objectives.filter(({id: objective}) =>
      !this.myObjectives.some(({id: myObjective}) =>
      myObjective === objective));

    objectivesDiff.map(objective => {
      if (objective.cycle.id === this.filter.cycle.id) {
        this.myKrs.map(kr => {
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
