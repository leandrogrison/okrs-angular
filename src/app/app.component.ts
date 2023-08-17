import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { DrawerService } from './services/drawer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isDrawerOpen = false;

  @ViewChild('drawerContent', {read: ViewContainerRef}) drawerContent!: ViewContainerRef;

  constructor(
    private drawerService: DrawerService
  ) {
    this.drawerService.openDrawer$.subscribe((result) => {
      this.drawerContent.remove();

      if (!result.component) return;

      let componentRef = this.drawerContent.createComponent(result.component);
      (<any>componentRef.instance).data = result.data;
      this.isDrawerOpen = true;
    });
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    setTimeout(() => {
      this.drawerContent.remove();
    }, 400)
  }

}
