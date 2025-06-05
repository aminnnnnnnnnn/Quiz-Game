import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  // Dies ist nur ein einfaches Beispiel. In der Realität könnten Sie hier API-Aufrufe machen.
  private categories = [
    { id: 1, name: 'Kategorie 1' },
    { id: 2, name: 'Kategorie 2' },
    // ...
  ];

  constructor() { }

  getAll() {
    return this.categories;
  }

  create(categoryData:any) {
    // Hier fügen Sie die Logik hinzu, um eine neue Kategorie zu erstellen.
    // Zum Beispiel, das Hinzufügen zur "categories" Liste:
    this.categories.push(categoryData);
  }

  // Weitere Methoden für create, update, delete, etc.
}
