import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpandAllService {

  private expandAllSubject = new Subject<any>();

  expandAll$ = this.expandAllSubject.asObservable();

  expandAll(expand: boolean) {
    this.expandAllSubject.next(expand);
  }
}
