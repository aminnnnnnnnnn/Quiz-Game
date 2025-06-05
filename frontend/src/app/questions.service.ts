import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  // Als Beispiel nehme ich an, Sie haben eine "questions" Eigenschaft.
  private questions = [
    { id: 1, question: 'Was ist ...?', answer: 'Antwort 1', categories: [1, 2] },
    // ...
  ];

  constructor() { }

  create(questionData:any) {
    // Hier fügen Sie die Logik hinzu, um eine neue Frage zu erstellen.
    // Zum Beispiel, das Hinzufügen zur "questions" Liste:
    this.questions.push(questionData);
  }

  // Weitere Methoden...
}
