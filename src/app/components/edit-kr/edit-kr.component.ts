import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { KrFormComponent } from '../kr-form/kr-form.component';

import { KR } from 'src/app/KR';
import { Objective } from 'src/app/Objective';

import { MessagesService } from 'src/app/services/messages.service';
import { KrsService } from 'src/app/services/krs.service';

@Component({
  selector: 'app-edit-kr',
  templateUrl: './edit-kr.component.html',
  styleUrls: ['./edit-kr.component.scss']
})
export class EditKrComponent {

  @ViewChild(KrFormComponent) KrForm!: KrFormComponent;

  kr!: KR;
  objective!: Objective;

  loading: boolean = false;

  constructor(
    private messagesService: MessagesService,
    private krsService: KrsService,
    private dialogRef: MatDialogRef<EditKrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.kr = data.kr;
    this.objective = data.objective;
  }

  async editKrHandler(kr: KR) {
    this.loading = true;

    this.krsService.updateKr(kr).subscribe({
      next: () => {
        this.loading = false;
        this.messagesService.show('KR salvo com sucesso!', 'success');
        this.closeModal(kr);
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao salvar KR! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  saveKr() {
    this.KrForm.saveKrButton();
  }

  closeModal(kr?: KR) {
    this.dialogRef.close(kr);
  }
}
