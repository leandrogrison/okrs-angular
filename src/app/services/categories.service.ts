import { Injectable } from '@angular/core';

import { Categorie } from 'src/app/Categorie';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

constructor() { }

  setCategories() {
    const categories: Categorie[] = [
      { value: 0, name: 'Objetivo da empresa' },
      { value: 1, name: 'Objetivo do grupo' },
      { value: 2, name: 'Objetivo individual' },
    ];

    return categories;
  }

}
