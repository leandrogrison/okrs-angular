import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Objective } from 'src/app/Objective';
import { User } from 'src/app/User';

@Component({
  selector: 'app-objective-list',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})
export class ObjectiveListComponent {

  @Input() objectives!: Objective[];
  @Input() owners!: User[];
  @Input() objectivesInBackground!: Objective[];
  @Output() updateObjectives = new EventEmitter();

  trackByObjective(index: number, item: Objective): any {
    return item.id;
  }

  handleUpdateObjectives(result: any) {
    this.updateObjectives.emit(result);
  }

}
