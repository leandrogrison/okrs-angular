import { Component, OnInit, Input } from '@angular/core';

import { DaysToEndService } from 'src/app/services/days-to-end.service';
import { ProgressStatusService } from 'src/app/services/progress-status.service';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-list',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})
export class ObjectiveListComponent implements OnInit {

  @Input() objectives!: Objective[];

  constructor(
    private daysToEndService: DaysToEndService,
    private progressStatusService: ProgressStatusService
  ) {}

  ngOnInit(): void {}

  trackByObjective(index: number, item: Objective): any {
    return item.id;
  }

  daysToEnd(deadline: string): number {
    return this.daysToEndService.daysToEnd(deadline);
  }

  getProgressStatus(objective: Objective): string {
    return this.progressStatusService.getProgressStatus(objective);
  }

}
