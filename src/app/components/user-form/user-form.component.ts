import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import 'hammerjs';

import { v4 as uuidv4 } from 'uuid';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { User } from 'src/app/User';
import { DeletePhotoComponent } from '../delete-photo/delete-photo.component';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input() userToEdit!:User;

  @Output() onSubmit = new EventEmitter<User>()
  @ViewChild('buttonSubmitHidden') buttonSubmitHidden!: ElementRef<HTMLElement>;
  @ViewChild('formUser') formUser!: any;

  user: User = {
    id: uuidv4(),
    name: '',
    photo: '',
    position: '',
    email: '',
    password: '',
    deleted: 0
  }

  confirmPassword: string = '';
  currentPassword: string = '';
  loggedUser!: User;

  showCrop: boolean = false;
  oldPhoto: any = '';
  changeImageEvent: any = '';

  constructor(
    public dialog: MatDialog,
    private messagesService: MessagesService,
    private authService: AuthService
  ) {
    this.loggedUser = this.authService.loggedUser$;
  }

  ngOnInit(): void {
    if (this.userToEdit) {
      this.user = { ...this.userToEdit };
    }
    this.user.password = '';
  }

  onFileChange(event: any): void {
    this.changeImageEvent = event;
  }

  cropImage(event: ImageCroppedEvent) {
    this.user.photo = event.base64;
  }

  imageLoad() {
    this.oldPhoto = this.user.photo;
    this.showCrop = true;
  }

  imageFailed() {
    this.messagesService.show('Erro ao carregar imagem.', 'warn');
  }

  confirmPhoto() {
    this.showCrop = false;
  }

  deletePhoto() {
    this.dialog.open(DeletePhotoComponent, {
      data: { photo: this.user.photo },
      maxWidth: 420,
      minWidth: 320,
      panelClass: 'dialog-alert'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.oldPhoto = '';
        this.user.photo = '';
      }
    });
  }

  cancelPhoto() {
    this.showCrop = false;
    this.user.photo = this.oldPhoto;
  }

  saveUserButton() {
    this.buttonSubmitHidden.nativeElement.click();
  }

  saveUser() {
    if (this.formUser.invalid || this.user.id === 'admin') return;

    this.user.name = this.user.name.replace(/^./, this.user.name[0].toUpperCase());

    if (this.userToEdit) {
      if (this.user.password === '') {
        this.user.password = this.userToEdit.password;
      } else {
        if (this.currentPassword !== this.userToEdit.password) {
          this.messagesService.show('Senha atual inválida!', 'warn');
          return;
        }
      }
    }

    this.onSubmit.emit(this.user);
  }

}
