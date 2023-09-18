import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { v4 as uuidv4 } from 'uuid';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { UserSingleSelectComponent } from '../user-single-select/user-single-select.component';

import { KR } from 'src/app/KR';
import { User } from 'src/app/User';

import { AuthService } from 'src/app/services/auth.service';
import { Objective } from 'src/app/Objective';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';

@Component({
  selector: 'app-kr-form',
  templateUrl: './kr-form.component.html',
  styleUrls: ['./kr-form.component.scss']
})
export class KrFormComponent implements OnInit {

  @Input() objective!: Objective;
  @Input() krToEdit!: KR;
  @Output() onSubmit = new EventEmitter<KR>();

  @ViewChild('formKr') formKr!: any;
  @ViewChild('buttonSubmitHidden') buttonSubmitHidden!: ElementRef<HTMLElement>;
  @ViewChild(UserSingleSelectComponent) userSingleSelect!: UserSingleSelectComponent;

  ownerMe: User = { id: '', name: '', photo: '' }
  updateList = Math.random()

  kr: KR = {
    id: uuidv4(),
    name: '',
    description: '',
    owner: null,
    type: 'percent',
    objective: '',
    progress: 0,
    tasks: [{
      id: uuidv4(),
      name: '',
      checked: false
    }]
  }

  constructor(
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.ownerMe = this.authService.loggedUser$;
  }

  ngOnInit(): void {
    if (this.krToEdit) {
      this.kr = JSON.parse(JSON.stringify(this.krToEdit));
      if (!this.krToEdit.tasks || this.krToEdit.tasks.length === 0) {
        this.kr.tasks = [{
          id: uuidv4(),
          name: '',
          checked: false
        }]
      }
    } else {
      this.kr.owner = this.objective.owner;
      this.kr.objective = this.objective.id!;
    }
  }

  updateOwnerHandler(owner: any) {
    this.kr.owner = owner && owner.id ? owner.id : undefined;
  }

  setOwnerMe(event: any) {
    if (event.checked) {
      this.updateOwnerHandler(this.ownerMe);
      this.userSingleSelect.autoCompleteUserExternal(this.ownerMe);
    } else {
      this.updateOwnerHandler(undefined);
      this.userSingleSelect.autoCompleteUserExternal(undefined);
    }
  }

  confirmDeleteTask(task: any) {
    this.dialog.open(DeleteTaskComponent, {
      data: { task: task },
      maxWidth: 420,
      minWidth: 320,
      panelClass: 'dialog-alert'
    }).afterClosed().subscribe(result => {
      if (result && result.hasOwnProperty('id')) this.deleteTask(task)
    });
  }

  deleteTask(task: any) {
    this.kr.tasks = this.kr.tasks.filter(t => t.id !== task.id);
  }

  addTask() {
    this.kr.tasks.push({
      id: uuidv4(),
      name: '',
      checked: false
    })
  }

  orderTasks(event: CdkDragDrop<any[]>) {
    const oldTarget = this.kr.tasks[event.previousIndex];

    this.kr.tasks[event.previousIndex] = this.kr.tasks[event.currentIndex];
    this.kr.tasks[event.currentIndex] = oldTarget;

    this.updateList = Math.random();
  }

  trackByTask(index: number, item: any): any {
    return this.updateList;
  }

  saveKrButton() {
    this.buttonSubmitHidden.nativeElement.click();
  }

  saveKr() {
    if (this.formKr.invalid) return;

    if (this.kr.type === 'value' && !this.krToEdit) this.kr.valued = 0;

    this.kr.tasks.map(task => {
      if (task.name.trim().length === 0) this.deleteTask(task);
    })

    this.onSubmit.emit(this.kr);
  }

}
