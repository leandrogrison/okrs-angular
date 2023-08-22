import { Component, Input } from '@angular/core';

import { Objective } from 'src/app/Objective';

import { ProgressStatusService } from 'src/app/services/progress-status.service';

@Component({
  selector: 'app-objective-map-item',
  templateUrl: './objective-map-item.component.html',
  styleUrls: ['./objective-map-item.component.scss']
})
export class ObjectiveMapItemComponent {

  @Input() objective!: Objective;

  constructor(private progressStatusService: ProgressStatusService) {}

  trackByObjective(index: number, item: Objective): any {
    return item.id;
  }

  getProgressStatus(objective: Objective): string {
    return this.progressStatusService.getProgressStatus(objective);
  }

}
