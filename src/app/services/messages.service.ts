import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MessagesComponent } from '../components/messages/messages.component';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private _snackBar: MatSnackBar) { }

  show(message: any, type?: string) {
    this._snackBar.openFromComponent(MessagesComponent, {
      duration: 5000,
      data: {
        message: message,
        type: type
      }
    });
  }
}
