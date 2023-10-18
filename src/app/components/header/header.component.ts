import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { User } from 'src/app/User';

import { EditUserComponent } from '../edit-user/edit-user.component';

import { AuthService } from 'src/app/services/auth.service';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() verifyMenuOpened = new EventEmitter();

  user!:User;
  menuOpened: boolean = false;

  constructor(
    private authService: AuthService,
    private drawerService: DrawerService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.user = this.authService.loggedUser$;
  }

  openMenu() {
    this.menuOpened = true;
    this.verifyMenuOpened.emit(true);
  }

  closeMenu() {
    this.menuOpened = false;
    this.verifyMenuOpened.emit(false);
    this.drawerService.openDrawer();
  }

  updateUser(user: User) {
    this.user = user;
  }

  openProfile(user: User) {
    this.dialog.open(EditUserComponent, {
      data: { user: user },
      maxWidth: 900,
      enterAnimationDuration: '0',
      width: 'calc(100% - 32px)',
      position: { top: '32px' },
    }).afterClosed().subscribe(result => {
      if (result?.id) {
        this.updateUser(result);
        this.authService.getUserInfo(result.id);
      }
    });
  }

  logout() {
    this.authService.logout();
  }

}
