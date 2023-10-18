import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Objective } from 'src/app/Objective';
import { KR } from 'src/app/KR';

import { ProgressStatusService } from 'src/app/services/progress-status.service';

@Component({
  selector: 'app-my-okrs-objectives',
  templateUrl: './my-okrs-objectives.component.html',
  styleUrls: ['./my-okrs-objectives.component.scss']
})
export class MyOkrsObjectivesComponent implements OnInit {

  @Input() objectives:Objective[] = [];
  @Input() myKrs:KR[] = [];
  @Output() updateObjectivesHandle = new EventEmitter();

  objectiveShowKRs: boolean[] = [];

  constructor(
    private progressStatusService: ProgressStatusService
  ) {}

  ngOnInit(): void {
    this.setInitialShowKRs();
  }

  setInitialShowKRs() {
    this.objectives.forEach(objective => {
      this.objectiveShowKRs.push(false);
    });
  }

  krsOfObjective(objective: Objective): KR[] {
    let krs:KR[] = [];

    this.myKrs.forEach(kr => {
      if (kr.objective ===  objective.id) krs.push(kr);
    })

    return krs;
  }

  getProgressStatus(objective: Objective): string {
    return this.progressStatusService.getProgressStatus(objective);
  }

  calcConclusionPercentOfObjective(event: any) {
    const numberOfKRs = event.objective.numberOfKRs ? event.objective.numberOfKRs : 0;
    const conclusionPercentOld = event.objective.conclusionPercent ? event.objective.conclusionPercent : 0;
    const verifyValueMaxOfProgress = event.kr.progress > 100 ? 100 : event.kr.progress;
    const verifyValueMaxOfOldProgress = event.oldKrProgress > 100 ? 100 : event.oldKrProgress;
    const diffBetweenProgressOfKR = (verifyValueMaxOfProgress - verifyValueMaxOfOldProgress) / numberOfKRs;
    const conclusionPercentOfObjective = conclusionPercentOld + diffBetweenProgressOfKR;

    event.objective.conclusionPercent = conclusionPercentOfObjective;
    this.updateObjectivesHandle.emit(event.objective);
  }

}
