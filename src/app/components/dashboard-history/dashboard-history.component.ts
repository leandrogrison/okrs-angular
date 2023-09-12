import { Component, Input, OnInit } from '@angular/core';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

import { Objective } from 'src/app/Objective';
import { Cycle } from 'src/app/Cycle';

@Component({
  selector: 'app-dashboard-history',
  templateUrl: './dashboard-history.component.html',
  styleUrls: ['./dashboard-history.component.scss']
})
export class DashboardHistoryComponent implements OnInit {

  @Input() objectives!: Objective[];
  @Input() cycles!: Cycle[];
  @Input() filter = {
    cycle: {
      id: `${new Date().getFullYear()}Q${this.quarterPipe.transform(new Date())}`,
      name: `${this.quarterPipe.transform(new Date())}° Trimestre ${new Date().getFullYear()}`
    }
  }

  history: any = {
    grid: { left: '36px', right: '8px', bottom: '90px' },
    color: [ '#424242', '#3F51B5', '#a33fb5', '#b5a33f' ],
    legend: {},
    tooltip: {
      confine: true,
      formatter: function (params: any) {
        const value = (Math.round(params.data[params.seriesName] * 10) / 10).toString().replace('.', ',') + '%'
        let tooltip = `<strong style="color: ${params.color}">${params.seriesName}</strong><br />`;
        if (params.name.indexOf('\n') >= 0) {
          tooltip += params.name.substring(0, params.name.indexOf('\n'));
        } else {
          tooltip += params.name;
        }
        tooltip += `: <strong>${value}</strong>`;
        return tooltip
      }
    },
    xAxis: { type: 'category' },
    yAxis: { min: 0, max: 100 },
    dataZoom: [
      { type: 'slider', backgroundColor: '#fff', borderColor: '#aaa', moveHandleSize: 16, showDetail: false,  brushSelect: false }
    ],
    series: [
      { type: 'bar', barWidth: '20%' },
      { type: 'bar', barWidth: '10%' },
      { type: 'bar', barWidth: '10%' },
      { type: 'bar', barWidth: '10%' }
    ],
    dataset: {
      dimensions: [] as string[],
      source: []
    }
  };

  constructor(
    private quarterPipe: QuarterPipe
  ) {}

  ngOnInit(): void {
    this.generateDataToChart();
  }

  generateDataToChart() {
    this.history.dataset.dimensions = ['cycle', 'Todos os objetivos', 'Empresa', 'Grupo', 'Individual'];

    this.cycles.map(cycle => {
      let cycleData = {
        cycle: cycle.id === this.filter.cycle.id ? `${cycle.name}\n(CICLO SELECIONADO)` : cycle.name,
        'Todos os objetivos': this.getobjectivesPerCycle(cycle, 'all'),
        'Empresa': this.getobjectivesPerCycle(cycle, 'company'),
        'Grupo': this.getobjectivesPerCycle(cycle, 'group'),
        'Individual': this.getobjectivesPerCycle(cycle, 'individual'),
      }

      this.history.dataset.source.push(cycleData);

      if (cycle.id === this.filter.cycle.id) {
        this.history.series.showBackground = true
        this.history.series.backgroundStyle
      }
    })
  }

  getobjectivesPerCycle(cycle: Cycle, type: string): number {
    let objetivesOfCycle:Objective[] = [];
    let conclusionPercent:number = 0;

    if (type === 'all') {
      objetivesOfCycle = this.objectives.filter(objective => objective.cycle.id === cycle.id );
    } else if (type === 'company') {
      objetivesOfCycle = this.objectives.filter(objective => objective.cycle.id === cycle.id && objective.category!.id === 0);
    } else if (type === 'group') {
      objetivesOfCycle = this.objectives.filter(objective => objective.cycle.id === cycle.id && objective.category!.id === 1);
    } else if (type === 'individual') {
      objetivesOfCycle = this.objectives.filter(objective => objective.cycle.id === cycle.id && objective.category!.id === 2);
    }

    objetivesOfCycle.map(objective => {
      conclusionPercent += objective.conclusionPercent ? objective.conclusionPercent : 0;
    });

    conclusionPercent = conclusionPercent / objetivesOfCycle.length;

    return conclusionPercent;
  }

}
