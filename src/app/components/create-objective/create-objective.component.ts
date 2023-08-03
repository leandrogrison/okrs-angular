import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ObjectiveFormComponent } from '../objective-form/objective-form.component';
import { MessagesService } from 'src/app/services/messages.service';

import { Objective } from 'src/app/Objective';

import { ObjectivesService } from 'src/app/services/objectives.service';

@Component({
  selector: 'app-create-objective',
  templateUrl: './create-objective.component.html',
  styleUrls: ['./create-objective.component.scss']
})
export class CreateObjectiveComponent {

  @ViewChild(ObjectiveFormComponent) objectiveForm!: ObjectiveFormComponent;

  loading: boolean = false;

  constructor(
    private objectivesService: ObjectivesService,
    private messagesService: MessagesService,
    private dialogRef: MatDialogRef<CreateObjectiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async createObjectiveHandler(objective: Objective) {
    this.loading = true;

    await this.objectivesService.createObjective(objective).subscribe({
      next: () => {
        this.loading = false;
        this.messagesService.show('Objetivo criado com sucesso!', 'success');
        this.closeModal();
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

  closeModal() {
    this.dialogRef.close();
  }
}
