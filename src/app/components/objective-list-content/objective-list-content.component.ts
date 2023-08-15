import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DaysToEndService } from 'src/app/services/days-to-end.service';
import { ProgressStatusService } from 'src/app/services/progress-status.service';

import { EditObjectiveComponent } from '../edit-objective/edit-objective.component';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-list-content',
  templateUrl: './objective-list-content.component.html',
  styleUrls: ['./objective-list-content.component.scss']
})
export class ObjectiveListContentComponent implements OnInit {

  @Input() objective!: Objective;
  @Output() updateObjectives = new EventEmitter();

  expandedItem: boolean = false;

  ngOnInit(): void {
    const expanded = this.objective.id ? localStorage.getItem(this.objective.id) : '';

    if (expanded === 'true' && this.objective.children) {
      this.expandedItem = true;
    }
  }

  constructor(
    public dialog: MatDialog,
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

  openEditObjective(objective: Objective) {
    this.dialog.open(EditObjectiveComponent, {
      data: { objective: objective },
      maxWidth: 900,
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result && result.hasOwnProperty('id')) this.updateObjectives.emit();
    });
  }

}
