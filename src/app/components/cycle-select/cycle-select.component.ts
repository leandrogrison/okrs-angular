import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

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
      id: `${this.getQuarter(this.date)}Q${this.date.getFullYear()}`,
      name: `${this.getQuarter(this.date)}° Trimestre ${this.date.getFullYear()}`
    }
  ]

  @ViewChild('cycles') cycles!: ElementRef;
  @ViewChild('cyclesContainer') cyclesContainer!: ElementRef;

  constructor() { }

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
    const month = this.getMonthInQuarter(parseFloat(this.quarters[position].id.substring(0, 1)));
    const year = parseFloat(this.quarters[position].id.substring(2));

    const date = new Date(year, month + (action === 'next' ? 3 : -2), 1);

    if (date.getMonth() !== (month + 3) % 12) {
      date.setDate(0);
    }

    this.quarters[action === 'next' ? 'push' : 'unshift'](
      {
        id: `${this.getQuarter(date)}Q${date.getFullYear()}`,
        name: `${this.getQuarter(date)}° Trimestre ${date.getFullYear()}`
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

  getQuarter(date: Date): number {
    const month = date.getMonth();

    if (month >= 1 && month <=3) return 1;
    if (month >= 4 && month <=6) return 2;
    if (month >= 7 && month <=9) return 3;
    return 4;
  }

  getMonthInQuarter(quarter: number): number {
    if (quarter === 2) return 4;
    if (quarter === 3) return 7;
    if (quarter === 4) return 10;
    return 1;
  }

}
