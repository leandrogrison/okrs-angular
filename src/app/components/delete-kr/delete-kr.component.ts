import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { KrsService } from 'src/app/services/krs.service';
import { MessagesService } from 'src/app/services/messages.service';

import { KR } from 'src/app/KR';

@Component({
  selector: 'app-delete-kr',
  templateUrl: './delete-kr.component.html',
  styleUrls: ['./delete-kr.component.scss']
})
export class DeleteKrComponent {

  @Input() kr!: KR;

  loading: boolean = false;

  constructor(
    private krsService: KrsService,
    private messagesService: MessagesService,
    private dialogRef: MatDialogRef<DeleteKrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.kr = data.kr;
  }

  deleteKr() {
    this.loading = true;

    this.krsService.deleteKr(this.kr).subscribe({
      next: () => {
        this.messagesService.show('KR excluído com sucesso!', 'success');
        this.loading = false;
        this.closeModal();
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
