import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Objective } from 'src/app/Objective';
import { User } from 'src/app/User';

@Component({
  selector: 'app-objective-list',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})
export class ObjectiveListComponent implements OnInit {

  @Input() objectives!: Objective[];
  @Input() owners!: User[];
  @Input() objectivesInBackground!: Objective[];
  @Output() updateObjectives = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  trackByObjective(index: number, item: Objective): any {
    return item.id;
  }

  handleUpdateObjectives(objective: Objective) {
    this.updateObjectives.emit(objective);
  }

}
