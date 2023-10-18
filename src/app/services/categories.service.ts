import { Injectable } from '@angular/core';

import { Category } from 'src/app/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  setCategories() {
    const categories: Category[] = [
      { id: 0, name: 'Objetivo da empresa' },
      { id: 1, name: 'Objetivo do grupo' },
      { id: 2, name: 'Objetivo individual' },
    ];

    return categories;
  }

}
