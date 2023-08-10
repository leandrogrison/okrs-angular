import { Component, Input, OnInit } from '@angular/core';

import { DaysToEndService } from 'src/app/services/days-to-end.service';
import { ProgressStatusService } from 'src/app/services/progress-status.service';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-list-content',
  templateUrl: './objective-list-content.component.html',
  styleUrls: ['./objective-list-content.component.scss']
})
export class ObjectiveListContentComponent implements OnInit {
  @Input() objective!: Objective;

  expandedItem: boolean = false;

  ngOnInit(): void {
    const expanded = this.objective.id ? localStorage.getItem(this.objective.id) : '';

    if (expanded === 'true' && this.objective.children) {
      this.expandedItem = true;
    }
  }

  constructor(
    private daysToEndService: DaysToEndService,
    private progressStatusService: ProgressStatusService
  ) {}

  daysToEnd(deadline: string): number {
    return this.daysToEndService.daysToEnd(deadline);
  }

  getProgressStatus(objective: Objective): string {
    return this.progressStatusService.getProgressStatus(objective);
  }

  expandItem(objective: Objective) {
    this.expandedItem = !this.expandedItem;
    if (objective.id) {
      localStorage.setItem(objective.id, this.expandedItem.toString());
    }
  }

}
