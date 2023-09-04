import { Component, EventEmitter, Output } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() verifyMenuOpened = new EventEmitter();

  userPhoto = '';
  menuOpened: boolean = false;

  constructor(private authService: AuthService) {
    this.userPhoto = this.authService.getUserInfo().photo;
  }

  openMenu() {
    this.menuOpened = true;
    this.verifyMenuOpened.emit(true);
  }

  closeMenu() {
    this.menuOpened = false;
    this.verifyMenuOpened.emit(false);
  }

}
