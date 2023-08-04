import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateObjectiveComponent } from '../../create-objective/create-objective.component';
import { ObjectivesService } from 'src/app/services/objectives.service';
import { MessagesService } from 'src/app/services/messages.service';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  objectives: Objective[] = [];
  cycles: any = [];
  search: string = '';

  loadingObjectives: boolean = true;

  constructor(
    private objectivesService: ObjectivesService,
    public dialog: MatDialog,
    private messagesService: MessagesService,
  ) {}

  ngOnInit(): void {
    this.getObjectives();

    this.cycles = [
      {
        id: '3Q2023',
        name: '3° Trimestre 2023'
      }
    ]
  }

  openCreateObjective() {
    this.dialog.open(CreateObjectiveComponent, {
      maxWidth: 900,
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result && result.id) this.getObjectives(result);
    });
  }

  closeCreateObjective() {
    this.dialog.closeAll();
  }

  getObjectives(event?: any) {
    this.loadingObjectives = true;
    this.objectivesService.getObjectives().subscribe({
      next: (objectives) => {
        this.objectives = objectives;
        this.loadingObjectives = false;
      },
      error: (error) => {
        this.loadingObjectives = false;
        this.messagesService.show('Erro ao buscar objetivos! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }


}
