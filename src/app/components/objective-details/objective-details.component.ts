import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Objective } from 'src/app/Objective';
import { User } from 'src/app/User';
import { KR } from 'src/app/KR';

import { UsersService } from 'src/app/services/users.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ProgressStatusService } from 'src/app/services/progress-status.service';
import { DaysToEndService } from 'src/app/services/days-to-end.service';
import { KrsService } from 'src/app/services/krs.service';

import { CreateKrComponent } from '../create-kr/create-kr.component';

@Component({
  selector: 'app-objective-details',
  templateUrl: './objective-details.component.html',
  styleUrls: ['./objective-details.component.scss']
})
export class ObjectiveDetailsComponent implements OnInit {

  @Input() data: any;
  @Output() updateObjectives = new EventEmitter();

  objective!: Objective;
  descriptionTruncate: boolean = true;
  supporters: User[] = [];
  krs: KR[] = [];
  loadingKrs: boolean = true;

  constructor(
    public dialog: MatDialog,
    private usersService: UsersService,
    private messagesService: MessagesService,
    private progressStatusService: ProgressStatusService,
    private daysToEndService: DaysToEndService,
    private krsService: KrsService
  ) {}

  ngOnInit(): void {
    this.objective = this.data.objective;

    this.getKrs();

    if (this.objective.supporters && this.objective.supporters.length > 0) {
      this.getSupporters();
    }
  }

  getKrs() {
    this.loadingKrs = true;
    this.krsService.getKrs(this.objective).subscribe({
      next: (krs) => {
        this.krs = krs;
        this.loadingKrs = false;
      },
      error: (error) => {
        this.loadingKrs = false;
        this.messagesService.show('Erro ao buscar krs! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  getSupporters() {
    this.usersService.getUsersById(this.objective.supporters).subscribe({
      next: (supporters: User[]) => {
        this.supporters = supporters;
      },
      error: (error) => {
        this.messagesService.show('Erro ao buscar apoiadores! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  getProgressStatus(objective: Objective): string {
    return this.progressStatusService.getProgressStatus(objective);
  }

  daysToEnd(deadline: string): number {
    return this.daysToEndService.daysToEnd(deadline);
  }

  createKR(objective: Objective) {
    this.dialog.open(CreateKrComponent, {
      data: { objective: objective },
      maxWidth: 900,
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result && result.hasOwnProperty('id')) this.getKrs();
    });
  }

  openEditKr(kr: KR) {

  }

  deleteKr(kr: KR) {

  }
}
