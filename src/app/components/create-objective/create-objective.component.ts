import { Component, ViewChild, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ObjectiveFormComponent } from '../objective-form/objective-form.component';

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
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateObjectiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  showMessage(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  async createObjectiveHandler(objective: Objective) {
    this.loading = true;

    await this.objectivesService.createObjective(objective).subscribe({
      next: () => {
        this.loading = false;
        this.showMessage('Objetivo criado com sucesso!', 'FECHAR');
        this.closeModal();
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Erro ao criar objetivo! Tente novamente mais tarde.', 'FECHAR');
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
