import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import questions from './questions';
import {Router} from "@angular/router";
import {SocketService} from "../services/socket/socket.service";


// @ts-ignore
@Component({
  selector: 'app-simplegame',
  templateUrl: './simplegame.component.html',
  styleUrls: ['./simplegame.component.css']
})


export class SimplegameComponent implements OnInit {

  buttonColor1: string = 'grey';
  buttonColor2: string = 'grey';
  buttonColor3: string = 'grey';
  buttonColor4: string = 'grey';


  constructor(private router: Router, private socketService: SocketService) {
    this.buttonColor1 = 'grey';
    this.buttonColor1 = 'grey';
    this.buttonColor1 = 'grey';
    this.buttonColor1 = 'grey';
  }


  questions = questions;
  currentQuestionIndex = 0;
  showResult = false;
  selectedOptions: number[] = [];
  remainingTime: number = 20; // In Sekunden
  //timer: any;

  @Input()
  question: any;

  @Input()
  gameId: number = 0;

  @Output()
  buttonNumberClicked = new EventEmitter<number>();

  @ViewChild('button1') button1: HTMLButtonElement | undefined;
  @ViewChild('button2') button2: HTMLButtonElement | undefined;
  @ViewChild('button3') button3: HTMLButtonElement | undefined;
  @ViewChild('button4') button4: HTMLButtonElement | undefined;


  myUserId: number = 0;

  @Input()
  round: any;


  test: string = "";
  toggle1: boolean = false;
  toggle2: boolean = false;
  toggle3: boolean = false;
  toggle4: boolean = false;


  ngOnInit() {
    if (localStorage.getItem("userId") != null) {
      this.myUserId = parseInt(localStorage.getItem("userId")!);
    } else {
      this.toLogin();
    }
    this.loadQuestions();
    this.socketService.receiveQuestion().subscribe(data => {
      this.test = String(data);
    });

    if (this.round == null) {
      this.round = 1;
    } else {
      this.round = Math.ceil(this.round / 2);
    }
  }

  toggle1Color() {
    this.toggle1 = !this.toggle1;
  }
  toggle2Color() {
    this.toggle2 = !this.toggle2;
  }
  toggle3Color() {
    this.toggle3 = !this.toggle3;
  }toggle4Color() {
    this.toggle4 = !this.toggle4;
  }



  private loadQuestions(): void {
    //this.socketService.loadQuestion();
  }

  buttonClicked(buttonNumber: number): void {

    console.log("solution: " + this.question[0].solution);

    console.log("button1 " + JSON.stringify(this.button1));

    if (this.question[0].solution == 1) {
        this.buttonColor1 = 'green';
    } else if (this.question[0].solution == 2) {
        this.buttonColor2 = 'green';
    } else if (this.question[0].solution == 3) {
        this.buttonColor3 = 'green';
    } else if (this.question[0].solution == 4) {
        this.buttonColor4 = 'green';
    }

    this.buttonNumberClicked.emit(buttonNumber);
  }

  /*startTimer() {
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.showResult = true; // Timer abgelaufen, Ergebnis anzeigen
        this.clearTimer();
      }
    }, 1000); // Alle 1 Sekunde
  }*/

  /*clearTimer() {
    clearInterval(this.timer);
  }*/

  previous() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  next() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.showTestResult(); // Hier wird die Methode aufgerufen, wenn die letzte Frage beantwortet wurde
    }
  }

  selectOption(currentQuestionIndex: number, i: number) {
    this.selectedOptions[currentQuestionIndex] = i;
  }

  calculateScore(): number {
    let score = 0;

    for (let i = 0; i < this.questions.length; i++) {

      if (this.selectedOptions[i] === this.questions[i].correctAnswer) {

        score++;
      }


    }

    return score;
  }

  showTestResult() {
    this.showResult = false;
  }

  toLogin(): void {
    this.router.navigate(['/']);
  }


  protected readonly JSON = JSON;
}
