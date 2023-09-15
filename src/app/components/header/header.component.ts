import { Component, EventEmitter, Output } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() verifyMenuOpened = new EventEmitter();

  userPhoto:any = undefined;
  menuOpened: boolean = false;

  constructor(private authService: AuthService, private drawerService: DrawerService) {
    this.userPhoto = this.authService.getUserInfo().photo;
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

}
