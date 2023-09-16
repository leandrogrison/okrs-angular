import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UsersService } from 'src/app/services/users.service';
import { MessagesService } from 'src/app/services/messages.service';

import { User } from 'src/app/User';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {

  @Input() user!: User;

  loading: boolean = false;

  constructor(
    private messagesService: MessagesService,
    private usersService: UsersService,
    private dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
  }

  deleteUser() {
    this.loading = true;

    this.usersService.deleteUser(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.messagesService.show('Usuário excluído com sucesso!', 'success');
        this.closeModal();
      },
      error: (error) => {
        this.messagesService.show('Erro ao excluir usuário! Tente novamente mais tarde.', 'warn');
        this.loading = false;
        console.log(error);
      }
    });
  }

  closeModal() {
    this.dialogRef.close(this.user);
  }

}
