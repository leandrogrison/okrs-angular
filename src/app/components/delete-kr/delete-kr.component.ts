import { Component, Input, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { KrsService } from 'src/app/services/krs.service';
import { ObjectivesService } from 'src/app/services/objectives.service';
import { MessagesService } from 'src/app/services/messages.service';

import { KR } from 'src/app/KR';
import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-delete-kr',
  templateUrl: './delete-kr.component.html',
  styleUrls: ['./delete-kr.component.scss']
})
export class DeleteKrComponent implements OnInit {

  @Input() kr!: KR;
  @Input() krs!: KR[];
  @Input() objective!: Objective;

  loading: boolean = false;

  constructor(
    private krsService: KrsService,
    private messagesService: MessagesService,
    private objectivesService: ObjectivesService,
    private dialogRef: MatDialogRef<DeleteKrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.kr = data.kr;
    this.krs = data.krs;
    this.objective = data.objective;
  }

  ngOnInit(): void {
  }

  updateObjective() {
    const krsFiltred = this.krs.filter(kr => kr.id !== this.kr.id);

    const progressValues = krsFiltred.map(kr => kr.progress > 100 ? 100 : kr.progress);
    const sumPercentOfKRs = progressValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const conclusionPercentOfObjective = sumPercentOfKRs / krsFiltred.length || 0;
    const numberOfKRs = this.objective.numberOfKRs ? this.objective.numberOfKRs - 1 : 0;

    this.objective.conclusionPercent = conclusionPercentOfObjective;
    this.objective.numberOfKRs = numberOfKRs;
    this.objective.numberOfKRsCompleted = krsFiltred.filter(kr => kr.progress >= 100).length;
  }

  deleteKr() {
    this.loading = true;

    this.updateObjective();

    let objectiveToSave: Objective = JSON.parse(JSON.stringify(this.objective));

    if (objectiveToSave.children) delete objectiveToSave.children;

    this.krsService.deleteKr(this.kr).subscribe({
      next: () => {
        this.objectivesService.updateObjective(objectiveToSave).subscribe({
          next: () => {
            this.loading = false;
            this.messagesService.show('KR excluído com sucesso!', 'success');
            this.closeModal();
          },
          error: (error) => {
            this.loading = false;
            this.messagesService.show('Erro ao atualizar o totalizador de KR do objetivo, mas o KR foi excluído!', 'warn');
            console.log(error);
          }
        })
      },
      error: (error) => {
        this.messagesService.show('Erro ao excluir KR! Tente novamente mais tarde.', 'warn');
        this.loading = false;
        console.log(error);
      }
    });
  }

  closeModal() {
    this.dialogRef.close(this.kr);
  }
}
