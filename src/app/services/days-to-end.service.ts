import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DaysToEndService {

  constructor() { }

  daysToEnd(deadline: string): number {
    const today: any = new Date();
    const deadlineToDate: any = new Date(deadline);
    const diffInMilliseconds = deadlineToDate - today;
    const diffDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    const restDays = Math.ceil(diffDays);

    return restDays;
  }
}
