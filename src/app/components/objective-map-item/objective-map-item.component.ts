import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Objective } from 'src/app/Objective';

import { ProgressStatusService } from 'src/app/services/progress-status.service';
import { ExpandAllService } from 'src/app/services/expand-all.service';
import { DrawerService } from 'src/app/services/drawer.service';

import { ObjectiveDetailsComponent } from '../objective-details/objective-details.component';
import { EditObjectiveComponent } from '../edit-objective/edit-objective.component';
import { DeleteObjectiveComponent } from '../delete-objective/delete-objective.component';

@Component({
  selector: 'app-objective-map-item',
  templateUrl: './objective-map-item.component.html',
  styleUrls: ['./objective-map-item.component.scss']
})
export class ObjectiveMapItemComponent implements OnInit {

  @Input() objective!: Objective;
  @Output() updateObjectives = new EventEmitter();

  positionMouseX: number = 0;
  positionMouseY: number = 0;

  expandedItem: boolean = false;

  constructor(
    public dialog: MatDialog,
    private progressStatusService: ProgressStatusService,
    private expandAllService: ExpandAllService,
    private drawerService: DrawerService
  ) {
    this.expandAllService.expandAll$.subscribe((action) => {
      this.expandAll(action);
    })
  }

  ngOnInit(): void {
    const expanded = this.objective.id ? localStorage.getItem(this.objective.id) : '';

    if (expanded === 'true' && this.objective.children) {
      this.expandedItem = true;
    }
  }

  trackByObjective(index: number, item: Objective): any {
    return item.id;
  }

  getProgressStatus(objective: Objective): string {
    return this.progressStatusService.getProgressStatus(objective);
  }

  clickedOnly(event: any) {
    this.positionMouseX = event.x;
    this.positionMouseY = event.y;
  }

  expandItem(objective: Objective, event: any) {

    if (!(event.x === this.positionMouseX && event.y === this.positionMouseY)) return;

    this.expandedItem = !this.expandedItem;

    if (objective.id) {
      localStorage.setItem(objective.id, this.expandedItem.toString());
    }
  }

  expandAll(action: boolean) {
    this.expandedItem = action;

    if (this.objective.id) {
      localStorage.setItem(this.objective.id, this.expandedItem.toString());
    }
  }

  openDetails(objective: Objective, event: any) {

    if (!(event.x === this.positionMouseX && event.y === this.positionMouseY)) return;

    const data = { objective: objective };
    this.drawerService.openDrawer(ObjectiveDetailsComponent, data);
  }

  openEditObjective(objective: Objective, event: any) {
    if (!(event.x === this.positionMouseX && event.y === this.positionMouseY)) return;

    this.drawerService.openDrawer();
    this.dialog.open(EditObjectiveComponent, {
      data: { objective: objective },
      maxWidth: 900,
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result && result.hasOwnProperty('id')) this.updateObjectives.emit();
    });
  }

  deleteObjective(objective: Objective, event: any) {
    if (!(event.x === this.positionMouseX && event.y === this.positionMouseY)) return;

    this.drawerService.openDrawer();
    this.dialog.open(DeleteObjectiveComponent, {
      data: { objective: objective },
      maxWidth: 420,
      minWidth: 320,
      panelClass: 'dialog-alert'
    }).afterClosed().subscribe(result => {
      if (result && result.hasOwnProperty('id')) this.updateObjectives.emit();
    });
  }

}
