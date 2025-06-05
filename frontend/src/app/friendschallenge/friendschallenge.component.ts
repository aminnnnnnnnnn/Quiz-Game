import { Component, OnInit } from '@angular/core';
import { questions } from '../simplegame/questions';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-friendschallenge',
  templateUrl: './friendschallenge.component.html',
  styleUrls: ['./friendschallenge.component.css'],
})
export class FriendschallengeComponent implements OnInit {
  questions = questions;
  currentQuestionIndex = 0;
  showResult = false;
  selectedOption: number | null = null;
  currentPlayer = 0;
  remainingTime = 3;
  scores: number[] = [0, 0];
  quizFinished = false;
  private timerSubscription: Subscription | null = null;
  activeUser: string | null = ""; // Der aktive Benutzername
  secondPlayerName: string | null = "";


  constructor(private router: Router, private modalService: NgbModal) { }


  ngOnInit() {

    this.activeUser       = localStorage.getItem("activeUser");
    this.secondPlayerName = localStorage.getItem('secondPlayerName');

    if (this.activeUser &&  this.secondPlayerName)
    {
      this.startTurn();
    } else {
      this.toLogin();
    }
  }

  toLogin() {
    this.router.navigate(['/']);
  }

  startTurn() {
    this.remainingTime = 2;
    this.selectedOption = null;
    this.showResult = false;
    this.startTimer();
  }

  startTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.showResult = true;
        this.clearTimer();
      }
    });
  }

  clearTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.calculateScore();

      if (this.currentPlayer === 0) {
        this.currentPlayer = 1; // Wechsel zum 2. Spieler
      } else {
        if (this.currentQuestionIndex === this.questions.length - 1) {
          this.quizFinished = true; // Quiz beenden, wenn alle Fragen beantwortet wurden
        } else {
          this.currentPlayer = 0; // Zurück zum 1. Spieler und zur nächsten Frage wechseln
          this.currentQuestionIndex++;
        }
      }

      this.startTurn(); // Starte den Timer für den nächsten Spieler oder die nächste Frage
    }
  }
  selectOption(optionIndex: number) {
    if (this.isCurrentPlayerTurn()) {
      this.selectedOption = optionIndex;
    }
  }

  isCurrentPlayerTurn() {
    return this.showResult === false;
  }

  calculateScore() {
    if (this.selectedOption !== null && this.selectedOption === this.questions[this.currentQuestionIndex].correctAnswer) {
      this.scores[this.currentPlayer]++;
    }
  }



}
