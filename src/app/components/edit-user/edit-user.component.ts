import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from 'src/app/User';

import { UserFormComponent } from '../user-form/user-form.component';

import { UsersService } from 'src/app/services/users.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {

  @ViewChild(UserFormComponent) userForm!: UserFormComponent;

  loading: boolean = false;

  user!: User;

  constructor(
    private usersService: UsersService,
    private messagesService: MessagesService,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
  }

  async editUserHandler(user: User) {
    this.loading = true;

    await this.usersService.updateUser(user).subscribe({
      next: () => {
        this.loading = false;
        this.messagesService.show('Usuário salvo com sucesso!', 'success');
        this.closeModal(user);
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao salvar usuário! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  saveUser() {
    this.userForm.saveUserButton();
  }

  closeModal(user?: User) {
    this.dialogRef.close(user);
  }

}
