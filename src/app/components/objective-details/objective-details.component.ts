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
import { ObjectivesService } from 'src/app/services/objectives.service';

import { CreateKrComponent } from '../create-kr/create-kr.component';
import { EditKrComponent } from '../edit-kr/edit-kr.component';
import { DeleteKrComponent } from '../delete-kr/delete-kr.component';

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
  oldKrProgress!: number;
  oldKrTask!: any;
  oldValued!: number;
  loadingKrs: boolean = true;
  delayToValued: any = null;

  constructor(
    public dialog: MatDialog,
    private usersService: UsersService,
    private messagesService: MessagesService,
    private progressStatusService: ProgressStatusService,
    private daysToEndService: DaysToEndService,
    private krsService: KrsService,
    private objectivesService: ObjectivesService
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
      data: {
        objective: objective,
        krs: this.krs
      },
      maxWidth: 900,
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result && result.hasOwnProperty('id')) this.getKrs();
    });
  }

  openEditKr(kr: KR) {
    this.dialog.open(EditKrComponent, {
      data: { kr: kr, objective: this.objective },
      maxWidth: 900,
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result && result.hasOwnProperty('id')) {
        if (result.type === 'value') {
          this.updateOnEdit(result);
        } else {
          this.getKrs();
        }
      }
    });
  }

  async updateOnEdit(kr: KR) {
    this.getCurrentProgress(kr);
    kr.progress = (kr.valued ? kr.valued : 0) / (kr.value ? kr.value : 0) * 100;
    this.krs.map((k, index) => {
      if (k.id === kr.id) this.krs[index] = kr;
    })
    this.updateProgress(kr);
    await this.getKrs();
  }

  deleteKr(kr: KR) {
    this.dialog.open(DeleteKrComponent, {
      data: {
        kr: kr,
        krs: this.krs,
        objective: this.objective
      },
      maxWidth: 420,
      minWidth: 320,
      panelClass: 'dialog-alert'
    }).afterClosed().subscribe(result => {
      if (result && result.hasOwnProperty('id')) this.getKrs();
    });
  }

  getCurrentProgress(kr: KR) {
    this.oldKrProgress = kr.progress;
  }

  getCurrentValue(kr: KR) {
    this.getCurrentProgress(kr);
    this.oldValued = kr.valued ? kr.valued : 0;
  }

  restoreProgress(kr: KR, oldKrProgress: number) {
    this.krs.forEach((k, index) => {
      if (kr.id === k.id) {
        this.krs[index].progress = oldKrProgress;
      }
    });

    this.objective.conclusionPercent = this.calcConclusionPercentOfObjective();
  }

  restoreTask(oldTask: any) {
    this.krs.forEach((kr, indexK) => {
      kr.tasks.forEach((task, indexT) => {
        if (task.id === oldTask.id) {
          this.krs[indexK].tasks[indexT] = oldTask;
        }
      })
    });
  }

  restoreValue(kr: KR, oldValued: number) {
    this.krs.forEach((k, index) => {
      if (kr.id === k.id) {
        this.krs[index].valued = oldValued;
      }
    });
  }

  calcConclusionPercentOfObjective(): number {
    const progressValues = this.krs.map(kr => kr.progress > 100 ? 100 : kr.progress);
    const sumPercentOfKRs = progressValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const conclusionPercentOfObjective = (sumPercentOfKRs / this.krs.length) || 0;

    return conclusionPercentOfObjective;
  }

  async updateProgress(kr: KR, oldTask?: any) {
    const oldKrProgress = this.oldKrProgress;
    const oldValued = this.oldValued;
    const oldNumberOfKRsCompleted = this.objective.numberOfKRsCompleted;

    this.objective.conclusionPercent = this.calcConclusionPercentOfObjective();
    this.objective.numberOfKRsCompleted = this.krs.filter(kr => kr.progress >= 100).length;

    let objectiveToSave: Objective = JSON.parse(JSON.stringify(this.objective));

    if (objectiveToSave.children) delete objectiveToSave.children;

    await this.krsService.updateKr(kr).subscribe({
      next: () => {
        this.objectivesService.updateObjective(objectiveToSave).subscribe({
          next: () => {},
          error: (error) => {
            if (oldTask) {
              this.restoreTask(oldTask);
            }
            if (kr.type === 'value') {
              this.restoreValue(kr, oldValued);
            }
            this.restoreProgress(kr, oldKrProgress);
            this.objective.numberOfKRsCompleted = oldNumberOfKRsCompleted;
            this.messagesService.show('Erro ao salvar progresso do objetivo! Tente novamente mais tarde.', 'warn');
            console.log(error);
          }
        })
      },
      error: (error) => {
        if (oldTask) {
          this.restoreTask(oldTask);
        }
        if (kr.type === 'value') {
          this.restoreValue(kr, oldValued);
        }
        this.restoreProgress(kr, oldKrProgress);
        this.messagesService.show('Erro ao salvar progresso do KR! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  updateTasks(kr: KR, task: any) {
    const totalChecked = kr.tasks.filter(task => task.checked);

    const oldKrTask = {
      id: task.id,
      name: task.name,
      checked: !task.checked
    };

    if (kr.type === 'task') {
      kr.progress = totalChecked.length / kr.tasks.length * 100;
    }

    this.updateProgress(kr, oldKrTask);
  }

  updateValue(kr: KR) {
    clearTimeout(this.delayToValued);

    this.delayToValued = setTimeout(() => {
      kr.progress = (kr.valued ? kr.valued : 0) / (kr.value ? kr.value : 0) * 100;
      this.updateProgress(kr);
    }, 500);

  }
}
