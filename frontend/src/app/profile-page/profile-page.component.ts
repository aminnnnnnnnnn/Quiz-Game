import {Component, OnInit} from '@angular/core';
import {QuestionsService} from "../questions.service";
import {CategoriesService} from "../categories.service";
import {AdminService} from "../services/admin/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {AuthenticationComponent} from "../authentication/authentication.component";
import questions from "../simplegame/questions";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  isAdmin: boolean = false;

  addQuestionForm !: FormGroup;
  addCategoryForm !: FormGroup;
  editQuestionForm !: FormGroup;
  editQuestionMode: boolean = false;

  success: boolean = false;
  error: boolean = false;
  responseMessage: string = "";
  categories: any[] = [];

  questions: any[] = [];

  questionToEdit: any;
  myUserId: number = 0;


  constructor(private questionService: QuestionsService,
              private categoryService: CategoriesService,
              private adminService: AdminService,
              private authentication: AuthenticationComponent) {
  }

  ngOnInit() {

    if (localStorage.getItem("userId") != null) {
      this.myUserId = parseInt(localStorage.getItem("userId")!);
    }

    if (localStorage.getItem("isAdmin") != null) {
      this.isAdmin = localStorage.getItem("isAdmin") == "true";
      console.log(this.isAdmin)
    }
/*
    if (localStorage.getItem("isAdmin") != null) {
      this.isAdmin = localStorage.getItem("isAdmin") == "true";
    }
*/
    this.getAllQuestions();

    //kann weg oder?
    //this.isAdmin = this.authentication.checkIfAdmin();

    this.addQuestionForm = this.createQuestionFormGroup();
    this.editQuestionForm = this.editQuestionFormGroup();
    this.addCategoryForm = this.createCategoryFormGroup();
  }

  createQuestionFormGroup() {
    return new FormGroup({
      question: new FormControl('', [Validators.required, Validators.minLength(1)]),
      answer1: new FormControl('', [Validators.required, Validators.minLength(1)]),
      answer2: new FormControl('', [Validators.required, Validators.minLength(1)]),
      answer3: new FormControl('', [Validators.required, Validators.minLength(1)]),
      answer4: new FormControl('', [Validators.required, Validators.minLength(1)]),
      solution: new FormControl('', [Validators.required, Validators.minLength(1)])
    })
  }

  editQuestionFormGroup() {
    return new FormGroup({
      question: new FormControl('', [Validators.required, Validators.minLength(1)]),
      answer1: new FormControl('', [Validators.required, Validators.minLength(1)]),
      answer2: new FormControl('', [Validators.required, Validators.minLength(1)]),
      answer3: new FormControl('', [Validators.required, Validators.minLength(1)]),
      answer4: new FormControl('', [Validators.required, Validators.minLength(1)]),
      solution: new FormControl('', [Validators.required, Validators.minLength(1)])
    })
  }

  createCategoryFormGroup() {
    return new FormGroup({
      category: new FormControl('', [Validators.required])
    })
  }

  addQuestion() {
    this.adminService.postQuestion(this.addQuestionForm.value).subscribe((data: any) => {
      this.success = true;
      this.error = false;
      this.responseMessage = data.message;

      setTimeout(() => {
        this.success = false;
        this.responseMessage = "";
      }, 2000);

      this.getAllQuestions();
    }, (error: any) => {
      this.error = true;
      this.success = false;
      this.responseMessage = error.message;

      setTimeout(() => {
        this.error = false;
        this.responseMessage = "";
      }, 2000);

    });
  }

  getAllQuestions() {
    this.adminService.getAllQuestions().subscribe((data: any) => {
      //this.questions = data.questions.question; data.questionId;

      this.questions = data;
    }, (error: any) => {
    });
  }

  removeQuestion(question: any) {
    this.adminService.deleteQuestion(question.question.questionId).subscribe((data: any) => {
      this.success = true;
      this.error = false;
      this.responseMessage = data.message;


      setTimeout(() => {
        this.success = false;
        this.responseMessage = "";
      }, 2000);

      this.closeModal();
      this.getAllQuestions();

    }, (error: any) => {
      this.error = true;
      this.success = false;
      this.responseMessage = error.message;

      setTimeout(() => {
        this.error = false;
        this.responseMessage = "";
      }, 2000);
    });
  }

  editQuestion() {
    this.adminService.updateQuestion(this.questionToEdit.question.questionId, this.editQuestionForm.value).subscribe((data: any) => {
      this.success = true;
      this.error = false;
      this.responseMessage = data.message;

      setTimeout(() => {
        this.success = false;
        this.responseMessage = "";
      }, 2000);

      this.closeModal();
      this.getAllQuestions();

    }, (error: any) => {
      this.error = true;
      this.success = false;
      this.responseMessage = error.message;

      setTimeout(() => {
        this.error = false;
        this.responseMessage = "";
      }, 2000);
    });
  }

  editClicked(question: any) {
    this.editQuestionMode = true;
  }

  openModal(question: any) {
    this.questionToEdit = question;
    const modelDiv = document.getElementById('myModal');
    if (modelDiv) {
      modelDiv.style.display = "block";
    }

  }

  closeModal() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv) {
      modelDiv.style.display = "none";
    }
  }

  getQuestionToEdit() {
    if (this.questionToEdit) {
      return this.questionToEdit.question.question;
    } else {
      return '';
    }
  }

  getAnswer1ToEdit() {
    if (this.questionToEdit) {
      return this.questionToEdit.question.answer1;
    } else {
      return '';
    }
  }

  getAnswer2ToEdit() {
    if (this.questionToEdit) {
      return this.questionToEdit.question.answer2;
    } else {
      return '';
    }
  }

  getAnswer3ToEdit() {
    if (this.questionToEdit) {
      return this.questionToEdit.question.answer3;
    } else {
      return '';
    }
  }

  getAnswer4ToEdit() {
    if (this.questionToEdit) {
      return this.questionToEdit.question.answer4;
    } else {
      return '';
    }
  }

  getSelectedIndex() {
    if (this.questionToEdit) {
      return this.questionToEdit.question.solution;
    } else {
      return '';
    }
  }

  protected readonly console = console;
}
