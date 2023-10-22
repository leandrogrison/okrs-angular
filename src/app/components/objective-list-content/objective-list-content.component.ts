import { Component, Input, Output, OnInit, EventEmitter, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DaysToEndService } from 'src/app/services/days-to-end.service';
import { ProgressStatusService } from 'src/app/services/progress-status.service';
import { DrawerService } from 'src/app/services/drawer.service';

import { EditObjectiveComponent } from '../edit-objective/edit-objective.component';
import { DeleteObjectiveComponent } from '../delete-objective/delete-objective.component';
import { ObjectiveDetailsComponent } from '../objective-details/objective-details.component';

import { Objective } from 'src/app/Objective';
import { User } from 'src/app/User';

@Component({
  selector: 'app-objective-list-content',
  templateUrl: './objective-list-content.component.html',
  styleUrls: ['./objective-list-content.component.scss']
})
export class ObjectiveListContentComponent implements OnInit, OnChanges {

  @Input() objective!: Objective;
  @Input() owners!: User[];
  @Input() objectivesInBackground!: Objective[];
  @Output() updateObjectives = new EventEmitter();

  expandedItem: boolean = true;
  owner!: User;

  ngOnInit() {
    const expanded = this.objective.id ? localStorage.getItem(this.objective.id) : '';

    if (expanded === 'false') {
      this.expandedItem = false;
    } else {
      this.expandedItem = true;
    }
  }

  ngOnChanges() {
    this.owner = this.owners.filter(owner => owner.id === this.objective.owner)[0];
  }

  constructor(
    public dialog: MatDialog,
    private daysToEndService: DaysToEndService,
    private progressStatusService: ProgressStatusService,
    public drawerService: DrawerService
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

  updatingObjective() {
    return this.objectivesInBackground.filter(obj => obj.id === this.objective.id).length ? 'disabled' : '';
  }

  openEditObjective(objective: Objective) {
    this.drawerService.openDrawer();
    this.dialog.open(EditObjectiveComponent, {
      data: { objective: objective },
      maxWidth: 900,
      enterAnimationDuration: '0',
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result?.objective) this.updateObjectives.emit(result);
    });
  }

  deleteObjective(objective: Objective) {
    this.drawerService.openDrawer();
    this.dialog.open(DeleteObjectiveComponent, {
      data: { objective: objective },
      maxWidth: 420,
      minWidth: 320,
      enterAnimationDuration: '0',
      panelClass: 'dialog-alert'
    }).afterClosed().subscribe(result => {
      if (result?.id) this.updateObjectives.emit(result);
    });
  }

  openDetails(objective: Objective, owner: User) {
    const data = { objective: objective, owner: owner };
    this.drawerService.openDrawer(ObjectiveDetailsComponent, data);
  }

}
