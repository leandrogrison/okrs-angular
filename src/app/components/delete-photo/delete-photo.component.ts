import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-photo',
  templateUrl: './delete-photo.component.html',
  styleUrls: ['./delete-photo.component.scss']
})
export class DeletePhotoComponent {

  @Input() photo: any;

  constructor(
    private dialogRef: MatDialogRef<DeletePhotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.photo = data.photo;
  }

  deletePhoto() {
    this.dialogRef.close(this.photo);
  }

}
