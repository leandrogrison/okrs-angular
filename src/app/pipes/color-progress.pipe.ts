import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ColorProgress'
})
export class ColorProgressPipe implements PipeTransform {

  transform(status: string): string {
    let result = 'primary'

    if (status === 'on-time') {
      result = 'success'
    } else if (status === 'alert') {
      result = 'accent'
    } else if (status === 'out-time') {
      result = 'warn'
    }

    return result
  }

}
