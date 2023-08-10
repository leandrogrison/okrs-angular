import { Component, OnInit, Input } from '@angular/core';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-list',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})
export class ObjectiveListComponent implements OnInit {

  @Input() objectives!: Objective[];

  constructor() {}

  ngOnInit(): void {}

  trackByObjective(index: number, item: Objective): any {
    return item.id;
  }

}
