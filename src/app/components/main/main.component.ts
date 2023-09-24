import { Component, ViewChild, ViewContainerRef, OnInit, Renderer2 } from '@angular/core';

import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isDrawerOpen = false;
  isMenuOpen = false;
  isSmallScreen = document.body.clientWidth < 1300;

  @ViewChild('drawerContent', {read: ViewContainerRef}) drawerContent!: ViewContainerRef;

  constructor(
    private drawerService: DrawerService,
    private renderer: Renderer2
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
