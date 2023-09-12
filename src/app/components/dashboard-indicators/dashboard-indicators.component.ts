import { Component, Input, OnInit, Renderer2 } from '@angular/core';

import { ProgressStatusService } from 'src/app/services/progress-status.service';

import { Objective } from 'src/app/Objective';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

@Component({
  selector: 'app-dashboard-indicators',
  templateUrl: './dashboard-indicators.component.html',
  styleUrls: ['./dashboard-indicators.component.scss']
})
export class DashboardIndicatorsComponent implements OnInit {

  @Input() objectives!: Objective[];
  @Input() filter = {
    cycle: {
      id: `${new Date().getFullYear()}Q${this.quarterPipe.transform(new Date())}`,
      name: `${this.quarterPipe.transform(new Date())}° Trimestre ${new Date().getFullYear()}`
    }
  }

  objectivesOfCycle: Objective[] = [];

  indicators = {
    allObjectives: {
      conclusionPercent: 0,
      numberOfObjectives: 0,
      onTimeNumberOfObjectives: 0,
      alertNumberOfObjectives: 0,
      outTimeNumberOfObjectives: 0
    },
    company: {
      conclusionPercent: 0,
      numberOfObjectives: 0,
      onTimeNumberOfObjectives: 0,
      alertNumberOfObjectives: 0,
      outTimeNumberOfObjectives: 0
    },
    group: {
      conclusionPercent: 0,
      numberOfObjectives: 0,
      onTimeNumberOfObjectives: 0,
      alertNumberOfObjectives: 0,
      outTimeNumberOfObjectives: 0
    },
    individual: {
      conclusionPercent: 0,
      numberOfObjectives: 0,
      onTimeNumberOfObjectives: 0,
      alertNumberOfObjectives: 0,
      outTimeNumberOfObjectives: 0
    }
  }

  isSmallScreen = document.body.clientWidth < 768;

  constructor(
    private progressStatusService: ProgressStatusService,
    private quarterPipe: QuarterPipe,
    private renderer: Renderer2
  ) {}

  windowResize = () => {};

  ngOnInit(): void {
    this.filterObjectivesOfCycle();
    this.generateIndicators();
    this.windowResize = this.renderer.listen(window, 'resize', () => {
      this.isSmallScreen = document.body.clientWidth < 768;
    });
  }

  filterObjectivesOfCycle() {
    this.objectives.map(objective => {
      if (objective.cycle.id === this.filter.cycle.id) {
        this.objectivesOfCycle.push(objective);
      }
    })
  }

  generateIndicators() {
    const categories = ['company', 'group', 'individual'];
    let conclusionPercentAllObjectives = 0;
    let onTimeAllObjectives = 0;
    let outTimeAllObjectives = 0;
    let alertAllObjectives = 0;

    this.objectivesOfCycle.map(objective => {

      conclusionPercentAllObjectives += objective.conclusionPercent ? objective.conclusionPercent : 0;

      const index = categories[objective.category!.id] as keyof typeof this.indicators;

      this.indicators[index].numberOfObjectives++;
      this.indicators[index].conclusionPercent += objective.conclusionPercent ? objective.conclusionPercent : 0;

      if (this.getProgressStatus(objective) === 'on-time') {
        this.indicators[index].onTimeNumberOfObjectives++;
        onTimeAllObjectives++;
      } else if (this.getProgressStatus(objective) === 'out-time') {
        this.indicators[index].outTimeNumberOfObjectives++;
        outTimeAllObjectives++;
      } else {
        this.indicators[index].alertNumberOfObjectives++;
        alertAllObjectives++;
      }

    });

    this.indicators.allObjectives.conclusionPercent = conclusionPercentAllObjectives / this.objectivesOfCycle.length;
    this.indicators.allObjectives.numberOfObjectives = this.objectivesOfCycle.length;
    this.indicators.allObjectives.onTimeNumberOfObjectives = onTimeAllObjectives;
    this.indicators.allObjectives.alertNumberOfObjectives = alertAllObjectives;
    this.indicators.allObjectives.outTimeNumberOfObjectives = outTimeAllObjectives;

    this.indicators.company.conclusionPercent = this.indicators.company.conclusionPercent / this.indicators.company.numberOfObjectives;
    this.indicators.group.conclusionPercent = this.indicators.group.conclusionPercent / this.indicators.group.numberOfObjectives;
    this.indicators.individual.conclusionPercent = this.indicators.individual.conclusionPercent / this.indicators.individual.numberOfObjectives;

  }

  getProgressStatus(objective: Objective): string {
    return this.progressStatusService.getProgressStatus(objective);
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

    if      (quarter === '1') return 0;
    else if (quarter === '2') return 3;
    else if (quarter === '3') return 6;
    else                      return 9;
  }

  getProgressStatusOfObjectives(type: string): string {
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

    const index = type as keyof typeof this.indicators;

    if (
      this.indicators[index].conclusionPercent >= expectedValue ||
      this.indicators[index].conclusionPercent >= 100
    ) {
      status = 'on-time'
    } else if (this.indicators[index].conclusionPercent >= (0.75 * expectedValue)) {
      status = 'alert'
    } else {
      status = 'out-time'
    }

    return status;
  }

}
