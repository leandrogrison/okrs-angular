import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ObjectiveFormComponent } from '../objective-form/objective-form.component';
import { MessagesService } from 'src/app/services/messages.service';

import { Objective } from 'src/app/Objective';
import { Cycle } from 'src/app/Cycle';

import { ObjectivesService } from 'src/app/services/objectives.service';
import { CyclesService } from 'src/app/services/cycles.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-objective',
  templateUrl: './edit-objective.component.html',
  styleUrls: ['./edit-objective.component.scss']
})
export class EditObjectiveComponent {

  @ViewChild(ObjectiveFormComponent) objectiveForm!: ObjectiveFormComponent;

  loading: boolean = false;
  reloadPage: boolean = false;

  objective!: Objective;

  constructor(
    private objectivesService: ObjectivesService,
    private cyclesService: CyclesService,
    private messagesService: MessagesService,
    private dialogRef: MatDialogRef<EditObjectiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.objective = data.objective;
  }

  async createCycle(objective: Objective) {
    return this.cyclesService.createCycle(objective.cycle).subscribe({
      next: () => {
        this.reloadPage = true;
        this.closeModal(objective);
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao criar cyclo deste objetivo! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    });
  }

  async verifyCycles(objective: Objective) {
    return this.cyclesService.getCycles().subscribe({
      next: (cycles: Cycle[]) => {
        if (!cycles.some(cycle => cycle.id === objective.cycle.id)) {
         this.createCycle(objective);
        } else {
          this.closeModal(objective);
        }
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao buscar ciclos! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  async editObjectiveHandler(objective: Objective) {
    this.loading = true;

    this.objectivesService.updateObjective(objective).pipe(
      switchMap(objective => {
        return this.verifyCycles(objective);
      })
    ).subscribe({
      next: () => {
        this.loading = false;
        this.messagesService.show('Objetivo salvo com sucesso!', 'success');
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao salvar objetivo! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  saveObjective() {
    this.objectiveForm.saveOjectiveButton();
  }

  closeModal(objective?: Objective) {
    const reloadPage = this.reloadPage;
    this.dialogRef.close({ objective, reloadPage });
  }

}
