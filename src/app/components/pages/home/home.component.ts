import { Component, OnInit } from '@angular/core';

import { CyclesService } from 'src/app/services/cycles.service';
import { ObjectivesService } from 'src/app/services/objectives.service';
import { KrsService } from 'src/app/services/krs.service';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';

import { Objective } from 'src/app/Objective';
import { KR } from 'src/app/KR';
import { Cycle } from 'src/app/Cycle';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  objectives: Objective[] = [];
  myKrs: KR[] = [];
  cycles: Cycle[] = [];
  filter = {
    cycle: {
      id: `${new Date().getFullYear()}Q${this.quarterPipe.transform(new Date())}`,
      name: `${this.quarterPipe.transform(new Date())}° Trimestre ${new Date().getFullYear()}`
    }
  }


  loadingObjectives: boolean = true;
  updateComponent = Math.random();

  constructor(
    private objectivesService: ObjectivesService,
    private cyclesService: CyclesService,
    private krsService: KrsService,
    private authService: AuthService,
    private messagesService: MessagesService,
    private quarterPipe: QuarterPipe
  ) {}

  ngOnInit(): void {
    this.getCycles();
  }

  getCycles() {
    this.loadingObjectives = true;
    this.cyclesService.getCycles().subscribe({
      next: (cycles) => {
        this.cycles = cycles;
        this.filter.cycle = cycles[0];
        this.getObjectives();
      },
      error: (error) => {
        this.loadingObjectives = false;
        this.messagesService.show('Erro ao buscar ciclos! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  getObjectives() {
    this.loadingObjectives = true;
    this.objectivesService.getObjectives().subscribe({
      next: (objectives) => {
        this.objectives = objectives;
        this.getMyKrs();
      },
      error: (error) => {
        this.loadingObjectives = false;
        this.messagesService.show('Erro ao buscar objetivos! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  getMyKrs() {
    const myUser = this.authService.loggedUser$;

    this.krsService.getKrsByUser(myUser).subscribe({
      next: (krs) => {
        this.myKrs = krs;
        this.loadingObjectives = false;
      },
      error: (error) => {
        this.loadingObjectives = false;
        this.messagesService.show('Erro ao buscar KRs! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    });

  }

  updateObjectives(objectiveUpdated: Objective) {
    this.objectives.forEach((objective, index) => {
      if (objective.id === objectiveUpdated.id) {
        this.objectives[index].conclusionPercent = objectiveUpdated.conclusionPercent;
        this.updateComponent = Math.random();
      }
    })
  }

}
