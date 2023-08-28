import { Component, Input, OnInit } from '@angular/core';

import { Objective } from 'src/app/Objective';

import { ProgressStatusService } from 'src/app/services/progress-status.service';
import { ExpandAllService } from 'src/app/services/expand-all.service';

@Component({
  selector: 'app-objective-map-item',
  templateUrl: './objective-map-item.component.html',
  styleUrls: ['./objective-map-item.component.scss']
})
export class ObjectiveMapItemComponent implements OnInit {

  @Input() objective!: Objective;

  positionMouseX: number = 0;
  positionMouseY: number = 0;

  expandedItem: boolean = false;

  constructor(private progressStatusService: ProgressStatusService, private expandAllService: ExpandAllService) {
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

  expandClicked(event: any) {
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

}
