import { Component, Input, OnInit } from '@angular/core';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-details',
  templateUrl: './objective-details.component.html',
  styleUrls: ['./objective-details.component.scss']
})
export class ObjectiveDetailsComponent implements OnInit {

  @Input() data: any;

  objective!: Objective;

  constructor() {}

  ngOnInit() {
    this.objective = this.data.objective;
  }


}
