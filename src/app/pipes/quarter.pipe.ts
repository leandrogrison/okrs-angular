import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quarter'
})
export class QuarterPipe implements PipeTransform {

  transform(date: Date): number {
    const month = date.getMonth();

    if (month >= 1 && month <=3) return 1;
    if (month >= 4 && month <=6) return 2;
    if (month >= 7 && month <=9) return 3;
    return 4;
  }

}
