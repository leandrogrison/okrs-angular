import { Component, inject, Inject } from '@angular/core';

import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {

  snackBarRef = inject(MatSnackBarRef);
  type: string = '';

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.type = data.type;
  }

}
