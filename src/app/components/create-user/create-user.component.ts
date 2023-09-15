import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from 'src/app/User';

import { UserFormComponent } from '../user-form/user-form.component';

import { UsersService } from 'src/app/services/users.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {

  @ViewChild(UserFormComponent) userForm!: UserFormComponent;

  loading: boolean = false;

  constructor(
    private usersService: UsersService,
    private messagesService: MessagesService,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async createUserHandler(user: User) {
    this.loading = true;

    await this.usersService.createUser(user).subscribe({
      next: () => {
        this.loading = false;
        this.messagesService.show('Usuário criado com sucesso!', 'success');
        this.closeModal(user);
      },
      error: (error) => {
        this.loading = false;
        this.messagesService.show('Erro ao criar usuário! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  createUser() {
    this.userForm.saveUserButton();
  }

  closeModal(user?: User) {
    this.dialogRef.close(user);
  }

}
