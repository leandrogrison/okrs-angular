import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateObjectiveComponent } from '../../create-objective/create-objective.component';
import { CyclesService } from 'src/app/services/cycles.service';
import { ObjectivesService } from 'src/app/services/objectives.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ProgressStatusService } from 'src/app/services/progress-status.service';
import { UsersService } from 'src/app/services/users.service';

import { Objective } from 'src/app/Objective';
import { Cycle } from 'src/app/Cycle';
import { User } from 'src/app/User';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  objectives: Objective[] = [];
  objectivesInBackground: Objective[] = [];
  objectivesLength: number = 0;
  cycles: Cycle[] = [];
  owners: User[] = [];
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
    private usersService: UsersService,
    private quarterPipe: QuarterPipe
  ) {}

  ngOnInit(): void {
    this.getCycles();
  }

  openCreateObjective() {
    this.dialog.open(CreateObjectiveComponent, {
      maxWidth: 900,
      enterAnimationDuration: '0',
      width: 'calc(100% - 32px)',
      panelClass: 'dialog-container-component',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result?.objective) this.updateObjectives(result);
    });
  }

  updateObjectives(result: any) {
    if (result.reloadPage) {
      this.getCycles();
    } else {
      this.updateObjectivesInBackground(result.objective);
    }
  }

  updateObjectivesInBackground(objective: Objective) {
    this.objectivesInBackground.push(objective);
    this.getObjectives(this.filter, objective);
  }

  removeObjectiveInBackground(objective: Objective) {
    this.objectivesInBackground = this.objectivesInBackground.filter(obj => obj.id !== objective.id);
  }

  closeCreateObjective() {
    this.dialog.closeAll();
  }

  async getCycles() {
    this.loadingObjectives = true;
    this.cyclesService.getCycles().subscribe({
      next: (cycles) => {
        this.cycles = cycles;
        this.filter.cycle = cycles[0];
        this.getObjectives(this.filter);
      },
      error: (error) => {
        this.loadingObjectives = false;
        this.messagesService.show('Erro ao buscar ciclos! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  getObjectives(filter?: any, updateInBackground?: Objective) {
    this.loadingObjectives = !updateInBackground;
    this.objectivesService.getObjectives(filter).subscribe({
      next: (objectives) => {
        this.objectives = objectives;
        this.filterSupporterAfterResponse();
        this.filterStatusAfterResponse();
        this.objectivesLength = this.objectives.length;
        this.mountAssociates();
        this.getOwners(objectives);
        this.loadingObjectives = false;
        if (updateInBackground) this.removeObjectiveInBackground(updateInBackground);
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

  insertObjectiveInPosition = (objs: Objective[], objective: Objective) => {
    objs.forEach((obj) => {
      if (obj.id === (objective.associate)) {
        if (!obj.children) {
          obj.children = []
        }
        obj.children.push(objective)
      } else if (obj.children) {
        this.insertObjectiveInPosition(obj.children, objective)
      }
      return obj
    })
    return objs
  }

  removeObjectivesChindren= (objs: Objective[]) => {
    return objs.filter( obj => !(obj.associate));
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

    const objectivesOrigin = this.objectives;

    objectivesOrigin.forEach(objective => {
      this.objectives = this.insertObjectiveInPosition(objectivesOrigin, objective);
      this.objectives = this.removeObjectivesChindren(objectivesOrigin);
    });

  }

  getOwners(objectives: Objective[]) {
    const ownersInObjectives = objectives.map(objective => objective.owner);
    this.usersService.getUsersById(ownersInObjectives).subscribe({
      next: (owners) => {
        this.owners = owners;
      },
      error: (error) => {
        this.loadingObjectives = false;
        this.messagesService.show('Erro ao buscar Responsáveis do objetivo!', 'warn');
        console.log(error);
      }
    })
  }
}
