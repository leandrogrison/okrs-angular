import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quarter'
})
export class QuarterPipe implements PipeTransform {

  transform(date: Date): number {
    const month = date.getMonth();

    if (month >= 0 && month <=2) return 1;
    if (month >= 3 && month <=5) return 2;
    if (month >= 6 && month <=8) return 3;
    return 4;
  }

}
