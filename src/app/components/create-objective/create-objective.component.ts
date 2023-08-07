import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ObjectiveFormComponent } from '../objective-form/objective-form.component';
import { MessagesService } from 'src/app/services/messages.service';

import { Objective } from 'src/app/Objective';
import { Cycle } from 'src/app/Cycle';

import { ObjectivesService } from 'src/app/services/objectives.service';
import { CyclesService } from 'src/app/services/cycles.service';

@Component({
  selector: 'app-create-objective',
  templateUrl: './create-objective.component.html',
  styleUrls: ['./create-objective.component.scss']
})
export class CreateObjectiveComponent implements OnInit {

  @ViewChild(ObjectiveFormComponent) objectiveForm!: ObjectiveFormComponent;

  loading: boolean = false;

  constructor(
    private objectivesService: ObjectivesService,
    private cyclesService: CyclesService,
    private messagesService: MessagesService,
    private dialogRef: MatDialogRef<CreateObjectiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
  }

  async createCycle(cycle: Cycle) {
    await this.cyclesService.createCycle(cycle).subscribe({
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao criar cyclo deste objetivo! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    });
  }

  async verifyCycles(objective: Objective) {
    await this.cyclesService.getCycles().subscribe({
      next: (cycles: Cycle[]) => {
        if (!cycles.some(cycle => cycle.id === objective.cycle.id)) {
         this.createCycle(objective.cycle);
        }
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao buscar ciclos! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  async createObjectiveHandler(objective: Objective) {
    this.loading = true;

    await this.verifyCycles(objective);

    await this.objectivesService.createObjective(objective).subscribe({
      next: () => {
        this.loading = false;
        this.messagesService.show('Objetivo criado com sucesso!', 'success');
        this.closeModal(objective);
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao criar objetivo! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  createObjective() {
    this.objectiveForm.saveOjectiveButton();
  }

  closeModal(objective?: Objective) {
    this.dialogRef.close(objective);
  }
}
