import { Component, OnInit } from '@angular/core';

import { CyclesService } from 'src/app/services/cycles.service';
import { ObjectivesService } from 'src/app/services/objectives.service';
import { MessagesService } from 'src/app/services/messages.service';

import { Objective } from 'src/app/Objective';
import { Cycle } from 'src/app/Cycle';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  objectives: Objective[] = [];
  cycles: Cycle[] = [];
  filter = {
    cycle: {
      id: `${new Date().getFullYear()}Q${this.quarterPipe.transform(new Date())}`,
      name: `${this.quarterPipe.transform(new Date())}° Trimestre ${new Date().getFullYear()}`
    }
  }

  loadingObjectives: boolean = true;

  constructor(
    private objectivesService: ObjectivesService,
    private cyclesService: CyclesService,
    private messagesService: MessagesService,
    private quarterPipe: QuarterPipe
  ) {}

  ngOnInit(): void {
    this.getCycles();
    this.getObjectives(this.filter);
  }

  async getCycles() {
    this.loadingObjectives = true;
    await this.cyclesService.getCycles().subscribe({
      next: (cycles) => {
        this.cycles = cycles;
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
