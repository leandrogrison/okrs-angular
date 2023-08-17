import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  private openDrawerSubject = new Subject<any>();

  openDrawer$ = this.openDrawerSubject.asObservable();

  openDrawer(component: any, data: any) {
    const componentAndData = {
      component: component,
      data: data
    }
    this.openDrawerSubject.next(componentAndData);
  }

}
