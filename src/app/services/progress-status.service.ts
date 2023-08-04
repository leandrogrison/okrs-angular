import { Injectable } from '@angular/core';

import { Objective } from 'src/app/Objective';

@Injectable({
  providedIn: 'root'
})
export class ProgressStatusService {

  constructor() { }

  diffDates(firstDate: string, lastDate: string | null): number {
    const today: any = new Date(firstDate);
    const deadlineToDate: any = lastDate ? new Date(lastDate) : new Date();
    const diffInMilliseconds = deadlineToDate - today;
    const diffDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    const restDays = Math.ceil(diffDays);

    return restDays;
  }

  getProgressStatus(objective: Objective): string {

    if (!objective.conclusionPercent) {
      objective.conclusionPercent = 0;
    }

    let status = '';
    let daysTotal = this.diffDates(objective.startDate, objective.deadline);
    let expectedDays = Math.abs(this.diffDates(objective.startDate, objective.endDate!));
    let expectedValue = expectedDays / daysTotal * 100

    if (objective.conclusionPercent >= expectedValue || objective.conclusionPercent >= 100) {
      status = 'on-time'
    } else if (objective.conclusionPercent >= (0.75 * expectedValue)) {
      status = 'alert'
    } else {
      status = 'out-time'
    }

    return status
  }

}
