import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'IconCategory'
})
export class IconCategoryPipe implements PipeTransform {

  transform(category: any): string {
    let result = '';

    if (category.id === 0) result = 'apartment';
    if (category.id === 1) result = 'groups';
    if (category.id === 2) result = 'person_pin_circle';

    return result;
  }

}
