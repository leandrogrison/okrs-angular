import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateObjectiveComponent } from '../../create-objective/create-objective.component';
import { CyclesService } from 'src/app/services/cycles.service';
import { ObjectivesService } from 'src/app/services/objectives.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ProgressStatusService } from 'src/app/services/progress-status.service';

import { Objective } from 'src/app/Objective';
import { Cycle } from 'src/app/Cycle';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  objectives: Objective[] = [];
  cycles: Cycle[] = [];
  keyword: string = '';
  filter = {
    search: '',
    category: [] as any,
    owner: null as any,
    supporter: null as any,
    cycle: {
      id: `${new Date().getFullYear()}Q${this.quarterPipe.transform(new Date())}`,
      name: `${this.quarterPipe.transform(new Date())}° Trimestre ${new Date().getFullYear()}`
    },
    status: {
      onTime: false,
      alert: false,
      outTime: false
    }
  }
  delayToSearch: any = null

  loadingObjectives: boolean = true;

  constructor(
    public dialog: MatDialog,
    private objectivesService: ObjectivesService,
    private cyclesService: CyclesService,
    private messagesService: MessagesService,
    private progressStatusService: ProgressStatusService,
    private quarterPipe: QuarterPipe
  ) {}

  ngOnInit(): void {
    this.getCycles();
    this.getObjectives(this.filter);
  }

  openCreateObjective() {
    this.dialog.open(CreateObjectiveComponent, {
      maxWidth: 900,
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result && result.id) this.getObjectives(this.filter);
    });
  }

  closeCreateObjective() {
    this.dialog.closeAll();
  }

  addQuarterToday() {
    const date = new Date();
    const quarterToday = `${date.getFullYear()}Q${this.quarterPipe.transform(date)}`

    if (!this.cycles.some(cycle => cycle.id === quarterToday)) {
      this.cycles.unshift({
        id: quarterToday,
        name: `${this.quarterPipe.transform(date)}° Trimestre ${date.getFullYear()}`
      })
    }
  }

  async getCycles() {
    this.loadingObjectives = true;
    await this.cyclesService.getCycles().subscribe({
      next: (cycles) => {
        this.cycles = cycles;
        this.addQuarterToday();
      },
      error: (error) => {
        this.loadingObjectives = false;
        this.messagesService.show('Erro ao buscar ciclos! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  getObjectives(filter?: any) {
    this.loadingObjectives = true;
    this.objectivesService.getObjectives(filter).subscribe({
      next: (objectives) => {
        this.objectives = objectives;
        this.filterSupporterAfterResponse();
        this.filterStatusAfterResponse();
        this.mountAssociates();
        this.loadingObjectives = false;
      },
      error: (error) => {
        this.loadingObjectives = false;
        this.messagesService.show('Erro ao buscar objetivos! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  changeSearchKeyword() {
    clearTimeout(this.delayToSearch);

    this.delayToSearch = setTimeout(() => {
      this.filter.search = this.keyword;
      this.getObjectives(this.filter);
    }, 500);

  }

  clearSearchKeyword() {
    this.keyword = '';
    this.filter.search = '';

    this.getObjectives(this.filter);
  }

  filterStatusAfterResponse() {
    if (this.filter.status.onTime || this.filter.status.alert || this.filter.status.outTime) {
      this.objectives = this.objectives.filter((objective: Objective) => {
        const status = this.progressStatusService.getProgressStatus(objective);
        const isOnTime = status === 'on-time' && this.filter.status.onTime;
        const isAlert = status === 'alert' && this.filter.status.alert;
        const isOutTime = status === 'out-time' && this.filter.status.outTime;

        return isOnTime || isAlert || isOutTime;
      })
    }
  }

  filterSupporterAfterResponse() {
    if (!this.filter.supporter) return;

    this.objectives = this.objectives.filter((obj: Objective) =>
      obj.supporters!.some(supporter => supporter === this.filter.supporter)
    )
  }

  mountAssociates() {
    if (
      this.filter.search !== '' ||
      this.filter.category.length !== 0 ||
      this.filter.owner ||
      this.filter.supporter ||
      this.filter.status.onTime ||
      this.filter.status.alert ||
      this.filter.status.outTime
    ) return;

    const insertObjectiveInPosition = (objs: Objective[], objective: Objective) => {
      objs.map((obj) => {
        if (obj.id === (objective.associate)) {
          if (!obj.children) {
            obj.children = []
          }
          obj.children.push(objective)
        } else if (obj.children) {
          insertObjectiveInPosition(obj.children, objective)
        }
        return objs
      })
      return objs
    }

    const removeObjectivesChindren= (objs: Objective[]) => {
      return objs.filter( obj => !(obj.associate))
    }

    this.objectives.forEach(objective => {
      this.objectives = insertObjectiveInPosition(this.objectives, objective)
      this.objectives = removeObjectivesChindren(this.objectives)
    });

  }
}
