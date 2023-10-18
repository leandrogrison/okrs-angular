import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { KrFormComponent } from '../kr-form/kr-form.component';

import { Objective } from 'src/app/Objective';
import { KR } from 'src/app/KR';

import { MessagesService } from 'src/app/services/messages.service';
import { KrsService } from 'src/app/services/krs.service';
import { ObjectivesService } from 'src/app/services/objectives.service';

@Component({
  selector: 'app-create-kr',
  templateUrl: './create-kr.component.html',
  styleUrls: ['./create-kr.component.scss']
})
export class CreateKrComponent {

  @ViewChild(KrFormComponent) KrForm!: KrFormComponent;

  objective!: Objective;
  krs!: KR[];

  loading: boolean = false;

  constructor(
    private messagesService: MessagesService,
    private krsService: KrsService,
    private objectivesService: ObjectivesService,
    private dialogRef: MatDialogRef<CreateKrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.objective = data.objective;
    this.krs = data.krs;
  }

  createKR() {
    this.KrForm.saveKrButton();
  }

  updateNumberOfKrs() {
    const total = this.objective.numberOfKRs ? this.objective.numberOfKRs + 1 : 1;

    this.objective.numberOfKRs = total;
  }

  updateConclusionPercent() {
    const progressValues = this.krs.map(kr => kr.progress > 100 ? 100 : kr.progress);
    const sumPercentOfKRs = progressValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const conclusionPercentOfObjective = (sumPercentOfKRs / (this.krs.length + 1)) || 0;

    this.objective.conclusionPercent = conclusionPercentOfObjective;
  }

  async createKRHandler(kr: KR) {
    this.loading = true;

    this.updateNumberOfKrs();
    this.updateConclusionPercent();

    let objectiveToSave: Objective = JSON.parse(JSON.stringify(this.objective));

    if (objectiveToSave.children) delete objectiveToSave.children;

    this.krsService.createKr(kr).subscribe({
      next: () => {
        this.objectivesService.updateObjective(objectiveToSave).subscribe({
          next: () => {
            this.loading = false;
            this.messagesService.show('KR criado com sucesso!', 'success');
            this.closeModal(kr);
          },
          error: (error) => {
            this.loading = false;
            this.messagesService.show('Erro ao atualizar o totalizador de KR do objetivo, mas o KR foi criado!', 'warn');
            console.log(error);
          }
        })

      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao criar KR! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  closeModal(kr?: KR) {
    this.dialogRef.close(kr);
  }
}
