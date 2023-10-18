import { Component, Input, OnChanges } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { ProgressStatusService } from 'src/app/services/progress-status.service';

import { Objective } from 'src/app/Objective';
import { User } from 'src/app/User';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';
import { KR } from 'src/app/KR';

@Component({
  selector: 'app-my-okrs-indicators',
  templateUrl: './my-okrs-indicators.component.html',
  styleUrls: ['./my-okrs-indicators.component.scss']
})
export class MyOkrsIndicatorsComponent implements OnChanges {

  @Input() objectives: Objective[] = [];
  @Input() myKrs: KR[] = [];
  @Input() filter = {
    cycle: {
      id: `${new Date().getFullYear()}Q${this.quarterPipe.transform(new Date())}`,
      name: `${this.quarterPipe.transform(new Date())}° Trimestre ${new Date().getFullYear()}`
    }
  }
  @Input() updateComponent!: any;

  ownerMe: User = { id: '', name: '', photo: '' }

  indicators = {
    conclusionPercent: 0,
    onTimeNumberOfObjectives: 0,
    outTimeNumberOfObjectives: 0,
    alertNumberOfObjectives: 0,
    numberOfObjectives: 0,
    numberOfKRs: 0,
    numberOfKRsCompleted: 0
  }

  constructor(
    private quarterPipe: QuarterPipe,
    private authService: AuthService,
    private progressStatusService: ProgressStatusService
  ) {
    this.ownerMe = this.authService.loggedUser$;
  }

  ngOnChanges() {
    this.generateIndicatorsOfObjectives();
    this.generateIndicatorsOfKrs();
  }

  getProgressStatus(objective: Objective): string {
    return this.progressStatusService.getProgressStatus(objective);
  }

  generateIndicatorsOfKrs() {
    let numberOfKRs = 0;
    let numberOfKRsCompleted = 0;

    this.myKrs.forEach(kr => {
      this.objectives.forEach(objective => {
        if (kr.objective === objective.id && objective.cycle.id === this.filter.cycle.id) {
          numberOfKRs++;
          if (kr.progress >= 100) numberOfKRsCompleted++;
        }
      })
    })

    this.indicators.numberOfKRs = numberOfKRs;
    this.indicators.numberOfKRsCompleted = numberOfKRsCompleted;
  }

  generateIndicatorsOfObjectives() {
    let totalConclusionPercent = 0;
    this.indicators.numberOfObjectives = 0;
    this.indicators.onTimeNumberOfObjectives = 0;
    this.indicators.outTimeNumberOfObjectives = 0;
    this.indicators.alertNumberOfObjectives = 0;

    this.objectives.forEach(objective => {
      if (
        objective.cycle.id === this.filter.cycle.id &&
        objective.owner === this.ownerMe.id
      ) {
        totalConclusionPercent += objective.conclusionPercent ? objective.conclusionPercent : 0;
        this.indicators.numberOfObjectives++;

        if (this.getProgressStatus(objective) === 'on-time') {
          this.indicators.onTimeNumberOfObjectives++;
        } else if (this.getProgressStatus(objective) === 'out-time') {
          this.indicators.outTimeNumberOfObjectives++;
        } else {
          this.indicators.alertNumberOfObjectives++;
        }
      }
    });

    this.indicators.conclusionPercent = totalConclusionPercent / this.indicators.numberOfObjectives;
  }

  diffDates(firstDate: string, lastDate: string | null): number {
    const today: any = new Date(firstDate);
    const deadlineToDate: any = lastDate ? new Date(lastDate) : new Date();
    const diffInMilliseconds = deadlineToDate - today;
    const diffDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    const restDays = Math.ceil(diffDays);

    return restDays;
  }

  getMonths(): number {
    const quarter = this.filter.cycle.id.substring(5);

    if (quarter === '1') return 0;
    else if (quarter === '2') return 3;
    else if (quarter === '3') return 6;
    else return 9;
  }

  getProgressStatusOfObjectives() {
    const today = new Date().toISOString().substring(0, 10);
    const year = parseFloat(this.filter.cycle.id.substring(0, 4));
    const startMonth = this.getMonths();
    const startDate = year + '-' + (startMonth + 1) + '-01';
    const deadline = new Date(year, startMonth + 3, 1);

    if (deadline.getMonth() !== (startMonth + 3) % 12) {
      deadline.setDate(0);
    }

    let status = '';
    let daysTotal = this.diffDates(startDate, deadline.toISOString().substring(0, 10));
    let expectedDays = Math.abs(this.diffDates(startDate, today));
    let expectedValue = expectedDays / daysTotal * 100

    if (
      this.indicators.conclusionPercent >= expectedValue ||
      this.indicators.conclusionPercent >= 100
    ) {
      status = 'on-time'
    } else if (this.indicators.conclusionPercent >= (0.75 * expectedValue)) {
      status = 'alert'
    } else {
      status = 'out-time'
    }

    return status;
  }

}
