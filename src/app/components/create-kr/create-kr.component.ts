import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { KrFormComponent } from '../kr-form/kr-form.component';

import { Objective } from 'src/app/Objective';
import { KR } from 'src/app/KR';

import { MessagesService } from 'src/app/services/messages.service';
import { KrsService } from 'src/app/services/krs.service';

@Component({
  selector: 'app-create-kr',
  templateUrl: './create-kr.component.html',
  styleUrls: ['./create-kr.component.scss']
})
export class CreateKrComponent implements OnInit {

  @ViewChild(KrFormComponent) KrForm!: KrFormComponent;

  objective!: Objective;

  loading: boolean = false;

  constructor(
    private messagesService: MessagesService,
    private krsService: KrsService,
    private dialogRef: MatDialogRef<CreateKrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.objective = data.objective;
  }

  ngOnInit(): void {
  }

  createKR() {
    this.KrForm.saveKrButton();
  }

  async createKRHandler(kr: KR) {
    this.loading = true;

    await this.krsService.createKr(kr).subscribe({
      next: () => {
        this.loading = false;
        this.messagesService.show('KR criado com sucesso!', 'success');
        this.closeModal(this.objective);
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao criar KR! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  closeModal(objective?: Objective) {
    this.dialogRef.close(objective);
  }
}
