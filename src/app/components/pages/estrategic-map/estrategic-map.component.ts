import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateObjectiveComponent } from '../../create-objective/create-objective.component';
import { CyclesService } from 'src/app/services/cycles.service';
import { ObjectivesService } from 'src/app/services/objectives.service';
import { MessagesService } from 'src/app/services/messages.service';
import { UsersService } from 'src/app/services/users.service';

import { Objective } from 'src/app/Objective';
import { Cycle } from 'src/app/Cycle';
import { User } from 'src/app/User';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

@Component({
  selector: 'app-estrategic-map',
  templateUrl: './estrategic-map.component.html',
  styleUrls: ['./estrategic-map.component.scss']
})
export class EstrategicMapComponent implements OnInit {

  objectives: Objective[] = [];
  objectivesInBackground: Objective[] = [];
  cycles: Cycle[] = [];
  owners: User[] = [];
  filter = {
    cycle: {
      id: `${new Date().getFullYear()}Q${this.quarterPipe.transform(new Date())}`,
      name: `${this.quarterPipe.transform(new Date())}° Trimestre ${new Date().getFullYear()}`
    }
  }

  loadingObjectives: boolean = true;

  constructor(
    public dialog: MatDialog,
    private objectivesService: ObjectivesService,
    private cyclesService: CyclesService,
    private messagesService: MessagesService,
    private quarterPipe: QuarterPipe,
    private usersService: UsersService
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
      if (result && result.id) this.updateObjectivesInBackground(result);
    });
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

  getObjectives(filter?: any, updateInBackground?: Objective) {
    this.loadingObjectives = !updateInBackground;
    this.objectivesService.getObjectives(filter).subscribe({
      next: (objectives) => {
        this.objectives = objectives;
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

  insertObjectiveInPosition = (objs: Objective[], objective: Objective) => {
    objs.map((obj) => {
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
    const objectivesOrigin = this.objectives;

    objectivesOrigin.map(objective => {
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
