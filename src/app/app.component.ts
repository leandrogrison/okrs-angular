import { Component, ViewChild, ViewContainerRef, OnInit, Renderer2 } from '@angular/core';

import { DrawerService } from './services/drawer.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isDrawerOpen = false;
  isMenuOpen = false;
  isSmallScreen = document.body.clientWidth < 1300;
  logged = false;

  @ViewChild('drawerContent', {read: ViewContainerRef}) drawerContent!: ViewContainerRef;

  constructor(
    private drawerService: DrawerService,
    private renderer: Renderer2,
    private authService: AuthService
  ) {
    this.drawerService.openDrawer$.subscribe((result) => {
      this.drawerContent.remove();

      if (!result.component) return;

      let componentRef = this.drawerContent.createComponent(result.component);
      (<any>componentRef.instance).data = result.data;
      this.isDrawerOpen = true;
    });
  }

  windowResize = () => {};

  ngOnInit() {
    this.authService.getUserInfo().subscribe(result => this.logged = true);
    this.windowResize = this.renderer.listen(window, 'resize', () => {
      this.isSmallScreen = document.body.clientWidth < 1300;
    });
  }

  ngOnDestroy() {
    this.windowResize();
  }

  verifyMenuOpened(opened: boolean) {
    this.isMenuOpen = opened;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    setTimeout(() => {
      this.drawerContent.remove();
    }, 400)
  }

}
