import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

@Component({
  selector: 'app-cycle-select',
  templateUrl: './cycle-select.component.html',
  styleUrls: ['./cycle-select.component.scss']
})
export class CycleSelectComponent implements OnInit {

  @Input() cycleData!: any;
  @Output() updateCycle = new EventEmitter();

  date = new Date()
  currentCycle = 0;

  quarters = [
    {
      id: `${this.date.getFullYear()}Q${this.quarterPipe.transform(this.date)}`,
      name: `${this.quarterPipe.transform(this.date)}° Trimestre ${this.date.getFullYear()}`
    }
  ]

  @ViewChild('cycles') cycles!: ElementRef;
  @ViewChild('cyclesContainer') cyclesContainer!: ElementRef;

  constructor(private quarterPipe: QuarterPipe) { }

  ngOnInit() {
    if (this.cycleData.id === '') {
      this.updateCycle.emit(this.quarters[0])
    }
    this.addQuarter('next');
    this.addQuarter('next');
    this.addQuarter('next');
    this.addQuarter('next');
  }

  addQuarter(action: string) {
    const position = action === 'next' ? this.quarters.length - 1 : 0;
    const year = parseFloat(this.quarters[position].id.substring(0, 4));
    const month = this.getMonthInQuarter(parseFloat(this.quarters[position].id.substring(5)));

    const date = new Date(year, month + (action === 'next' ? 3 : -2), 1);

    if (date.getMonth() !== (month + 3) % 12) {
      date.setDate(0);
    }

    this.quarters[action === 'next' ? 'push' : 'unshift'](
      {
        id: `${date.getFullYear()}Q${this.quarterPipe.transform(date)}`,
        name: `${this.quarterPipe.transform(date)}° Trimestre ${date.getFullYear()}`
      }
    )

    this.moveCycles(action);
  }

  moveCycles(action: string) {
    if (!this.cycles) return

    if (action === 'next') {
      this.currentCycle = this.currentCycle + 1
    } else {
      this.cyclesContainer.nativeElement.scrollTo({
        left: this.cycles.nativeElement.childNodes[this.currentCycle + 1].offsetLeft
      });
    }
    setTimeout(() => {
      this.cyclesContainer.nativeElement.scrollTo({
        left: this.cycles.nativeElement.childNodes[this.currentCycle].offsetLeft,
        behavior: 'smooth'
      });
    }, 100);
  }

  getMonthInQuarter(quarter: number): number {
    if (quarter === 2) return 4;
    if (quarter === 3) return 7;
    if (quarter === 4) return 10;
    return 1;
  }

}
