import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { UserSingleSelectComponent } from '../user-single-select/user-single-select.component';

import { KR } from 'src/app/KR';
import { User } from 'src/app/User';

import { AuthService } from 'src/app/services/auth.service';
import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-kr-form',
  templateUrl: './kr-form.component.html',
  styleUrls: ['./kr-form.component.scss']
})
export class KrFormComponent implements OnInit {

  @Input() objective!: Objective
  @Output() onSubmit = new EventEmitter<KR>()

  @ViewChild('formKr') formKr!: any;
  @ViewChild('buttonSubmitHidden') buttonSubmitHidden!: ElementRef<HTMLElement>;
  @ViewChild(UserSingleSelectComponent) userSingleSelect!: UserSingleSelectComponent;

  ownerMe: User = { id: -1, name: '', photo: '' }
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
    private authService: AuthService
  ) {
    this.ownerMe = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.kr.owner = this.objective.owner;
    this.kr.objective = this.objective.id!;
  }

  updateOwnerHandler(owner: any) {
    this.kr.owner = owner;
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

    this.onSubmit.emit(this.kr);
  }

}
