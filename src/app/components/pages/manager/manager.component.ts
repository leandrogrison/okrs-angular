import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateObjectiveComponent } from '../../create-objective/create-objective.component';
import { ObjectivesService } from 'src/app/services/objectives.service';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  objectives: Objective[] = [];
  cycles: any = [];
  keyword: string = '';
  filter = {
    search: '',
    category: [] as any,
    owner: null as any,
    supporter: null as any
  }
  delayToSearch: any = null

  loadingObjectives: boolean = true;

  constructor(
    public dialog: MatDialog,
    private objectivesService: ObjectivesService,
    private messagesService: MessagesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getObjectives();

    this.cycles = [
      {
        id: '3Q2023',
        name: '3° Trimestre 2023'
      }
    ]
  }

  openCreateObjective() {
    this.dialog.open(CreateObjectiveComponent, {
      maxWidth: 900,
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result && result.id) this.getObjectives();
    });
  }

  closeCreateObjective() {
    this.dialog.closeAll();
  }

  getObjectives(filter?: any) {
    this.loadingObjectives = true;
    this.objectivesService.getObjectives(filter).subscribe({
      next: (objectives) => {
        if (this.filter.supporter) {
          this.objectives = this.verifySupporter(objectives);
        } else {
          this.objectives = objectives;
        }
        this.loadingObjectives = false;
      },
      error: (error) => {
        this.loadingObjectives = false;
        this.messagesService.show('Erro ao buscar objetivos! Tente novamente mais tarde.', 'warn');
        console.log(error);
      }
    })
  }

  changeSearchKeyword() {
    clearTimeout(this.delayToSearch);

    this.delayToSearch = setTimeout(() => {
      this.filter.search = this.keyword;
      this.getObjectives(this.filter);
    }, 500);

  }

  clearSearchKeyword() {
    this.keyword = '';
    this.filter.search = '';

    this.getObjectives(this.filter);
  }

  filterCategory(category: any) {
    if (this.filter.category.includes(category)) {
      this.filter.category = this.filter.category.filter((cat: any) => {
        return cat !== category
      });
    } else {
      this.filter.category.push(category);
    }

    this.getObjectives(this.filter);
  }

  filterOwner(owner: boolean) {
    if (owner) {
      this.filter.owner = this.authService.getUserInfo().id;
    } else {
      this.filter.owner = null;
    }

    this.getObjectives(this.filter);
  }

  filterSupporter(supporter: boolean) {
    if (supporter) {
      this.filter.supporter = this.authService.getUserInfo().id;
    } else {
      this.filter.supporter = null;
    }

    this.getObjectives(this.filter);
  }

  verifySupporter(objectives: Objective[]): any {
    return objectives.filter((obj: Objective) =>
      obj.supporters!.some(supporter => supporter === this.filter.supporter)
    )
  }
}
