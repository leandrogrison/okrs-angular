import { Component, Input, Output, ChangeDetectorRef, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { KR } from 'src/app/KR';
import { Objective } from 'src/app/Objective';
import { User } from 'src/app/User';

import { EditKrComponent } from '../edit-kr/edit-kr.component';
import { DeleteKrComponent } from '../delete-kr/delete-kr.component';

import { ObjectivesService } from 'src/app/services/objectives.service';
import { KrsService } from 'src/app/services/krs.service';
import { MessagesService } from 'src/app/services/messages.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-kr-list',
  templateUrl: './kr-list.component.html',
  styleUrls: ['./kr-list.component.scss']
})
export class KrListComponent implements OnInit {

  @Input() objective!: Objective;
  @Input() krs!: KR[];
  @Input() managerActions!: Boolean;
  @Output() getKRsHandle = new EventEmitter();
  @Output() calcConclusionPercentOfObjectiveHandle = new EventEmitter();

  oldKrProgress!: number;
  oldKrTask!: any;
  oldValued!: number;
  delayToValued: any = null;
  isMobile: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  unblockSlider: boolean[] = [];
  owners: User[] = [];

  constructor(
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private objectivesService: ObjectivesService,
    private krsService: KrsService,
    private messagesService: MessagesService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.getOwners();
  }

  getOwners() {
    const ownersInKrs = this.krs.map(kr => kr.owner);
    this.usersService.getUsersById(ownersInKrs).subscribe({
      next: (owners) => {
        this.krs.forEach(kr => {
          this.owners.push(owners.filter(owner => owner.id === kr.owner)[0]);
        });
      },
      error: (error) => {
        this.messagesService.show('Erro ao buscar Responsáveis dos KRs!', 'warn');
        console.log(error);
      }
    })
  }

  openEditKr(kr: KR) {
    this.dialog.open(EditKrComponent, {
      data: { kr: kr, objective: this.objective },
      maxWidth: 900,
      enterAnimationDuration: '0',
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result?.id) {
        if (result.type === 'value') {
          this.updateOnEdit(result);
        } else {
          this.getKRsHandle.emit();
        }
      }
    });
  }

  async updateOnEdit(kr: KR) {
    this.getCurrentProgress(kr);
    kr.progress = (kr.valued ? kr.valued : 0) / (kr.value ? kr.value : 0) * 100;
    this.krs.forEach((k, index) => {
      if (k.id === kr.id) this.krs[index] = kr;
    })
    this.updateProgress(kr);
    this.getKRsHandle.emit();
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
      enterAnimationDuration: '0',
      panelClass: 'dialog-alert'
    }).afterClosed().subscribe(result => {
      if (result?.id) this.getKRsHandle.emit();
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
    const objective = this.objective;
    let krToRestore = kr;
    let progressWithError = 0;

    this.krs.forEach((k, index) => {
      if (kr.id === k.id) {
        progressWithError = this.krs[index].progress;
        this.krs[index].progress = oldKrProgress;
        krToRestore = this.krs[index];
      }
    });

    this.calcConclusionPercentOfObjectiveHandle.emit({ objective, krToRestore, progressWithError });
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

  async updateProgress(kr: KR, oldTask?: any) {
    const oldKrProgress = this.oldKrProgress;
    const oldValued = this.oldValued;
    const oldNumberOfKRsCompleted = this.objective.numberOfKRsCompleted;
    const objective = this.objective;

    this.calcConclusionPercentOfObjectiveHandle.emit({ objective, kr, oldKrProgress });
    this.objective.numberOfKRsCompleted = this.krs.filter(kr => kr.progress >= 100).length;

    let objectiveToSave: Objective = JSON.parse(JSON.stringify(this.objective));

    if (objectiveToSave.children) delete objectiveToSave.children;

    this.krsService.updateKr(kr).subscribe({
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

  updateValue(kr: KR, valued: any) {
    this.getCurrentValue(kr);
    kr.valued = valued;
    clearTimeout(this.delayToValued);

    this.delayToValued = setTimeout(() => {
      kr.progress = (kr.valued ? kr.valued : 0) / (kr.value ? kr.value : 0) * 100;
      this.updateProgress(kr);
    }, 500);

  }

  blockSlider(i: number) {
    setTimeout(() => {
      this.unblockSlider[i] = false;
      this.changeDetectorRef.detectChanges();
    }, 400);
  }


}
