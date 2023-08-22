import { Component, Input, OnInit } from '@angular/core';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-map',
  templateUrl: './objective-map.component.html',
  styleUrls: ['./objective-map.component.scss']
})
export class ObjectiveMapComponent implements OnInit {

  @Input() objectives!: Objective[];

  zoomFactor: number = 100;

  ngOnInit(): void {
  }

  trackByObjective(index: number, item: Objective): any {
    return item.id;
  }

}
