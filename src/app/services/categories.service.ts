import { Injectable } from '@angular/core';

import { Categorie } from 'src/app/Categorie';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

constructor() { }

  setCategories() {
    const categories: Categorie[] = [
      { id: 0, name: 'Objetivo da empresa' },
      { id: 1, name: 'Objetivo do grupo' },
      { id: 2, name: 'Objetivo individual' },
    ];

    return categories;
  }

}
