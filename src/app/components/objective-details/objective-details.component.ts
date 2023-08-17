import { Component, Input, OnInit } from '@angular/core';

import { Objective } from 'src/app/Objective';
import { User } from 'src/app/User';

import { UsersService } from 'src/app/services/users.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ProgressStatusService } from 'src/app/services/progress-status.service';
import { DaysToEndService } from 'src/app/services/days-to-end.service';

@Component({
  selector: 'app-objective-details',
  templateUrl: './objective-details.component.html',
  styleUrls: ['./objective-details.component.scss']
})
export class ObjectiveDetailsComponent implements OnInit {

  @Input() data: any;

  objective!: Objective;
  descriptionTruncate: boolean = true;
  supporters: User[] = [];

  constructor(
    private usersService: UsersService,
    private messagesService: MessagesService,
    private progressStatusService: ProgressStatusService,
    private daysToEndService: DaysToEndService
  ) {}

  ngOnInit() {
    this.objective = this.data.objective;

    if (this.objective.supporters && this.objective.supporters.length > 0) {
      this.getSupporters();
    }
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
}
