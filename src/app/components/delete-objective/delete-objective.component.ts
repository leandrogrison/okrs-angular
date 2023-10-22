import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ObjectivesService } from 'src/app/services/objectives.service';
import { KrsService } from 'src/app/services/krs.service';
import { MessagesService } from 'src/app/services/messages.service';

import { Objective } from './../../Objective';

@Component({
  selector: 'app-delete-objective',
  templateUrl: './delete-objective.component.html',
  styleUrls: ['./delete-objective.component.scss']
})
export class DeleteObjectiveComponent {

  @Input() objective!: Objective;

  loading: boolean = false;
  deletedObjectives: number = 0;
  notDeletedObjectives: number = 0;

  constructor(
    private objectivesService: ObjectivesService,
    private messagesService: MessagesService,
    private krsService: KrsService,
    private dialogRef: MatDialogRef<DeleteObjectiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.objective = data.objective;
  }

  deleteKrsOfObjective(objective: Objective) {
    this.krsService.getKrs(objective).subscribe({
      next: (krs) => {
        krs.forEach(kr => this.krsService.deleteKr(kr).subscribe({
          next: () => {},
          error: (error) => {
            this.messagesService.show('Erro ao excluir KRs do objetivo!', 'warn');
            console.log(error);
          }
        }));
      },
      error: (error) => {
        this.messagesService.show('Erro ao excluir KRs do objetivo!', 'warn');
        console.log(error);
      }
    });
  }

  deleteObjective(objective: Objective) {
    this.loading = true;

    this.deleteKrsOfObjective(objective);

    this.objectivesService.deleteObjective(objective).subscribe({
      next: () => {
        this.deletedObjectives += 1;

        if (objective.children && objective.children.length > 0) {
          objective.children.map((objectiveToDeleteChild: Objective) => {
            this.deleteObjective(objectiveToDeleteChild)
          })
        } else {
          this.loading = false;

          if (this.deletedObjectives === 1) {
            this.messagesService.show('Objetivo excluído com sucesso!', 'success');
          }
          if (this.deletedObjectives > 1) {
            this.messagesService.show(`${this.deletedObjectives} objetivos excluídos com sucesso!`, 'success');
          }
          this.closeModal(objective);
        }
      },
      error: (error) => {
        this.notDeletedObjectives += 1;

        if (objective.children && objective.children.length > 0) {
          objective.children.map((objectiveToDeleteChild: Objective) => {
            this.deleteObjective(objectiveToDeleteChild)
          })
        } else {
          this.loading = false;

          if (this.notDeletedObjectives === 1) {
            this.messagesService.show('Erro ao excluir objetivo! Tente novamente mais tarde.', 'warn');
          }
          if (this.notDeletedObjectives > 1) {
            this.messagesService.show(`${this.notDeletedObjectives} objetivos não foram excluídos! Tente novamente mais tarde.`, 'warn');
          }
        }
        console.log(error);
      }
    });
  }

  closeModal(objective?: Objective) {
    const reloadPage = false;
    this.dialogRef.close({ objective, reloadPage });
  }

}
