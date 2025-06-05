import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit{

  editQuestionForm !: FormGroup;

  @Input() question: any;

  constructor() {
  }

  ngOnInit(): void {
    this.editQuestionForm = this.editQuestionFormGroup();
  }

  editQuestionFormGroup() {
    return new FormGroup({
      question: new FormControl('', [Validators.required]),
      answer1: new FormControl('', [Validators.required]),
      answer2: new FormControl('', [Validators.required]),
      answer3: new FormControl('', [Validators.required]),
      answer4: new FormControl('', [Validators.required]),
      solution: new FormControl('', [Validators.required])
      //categories: new FormControl('', [Validators.required])
    })
  }

  editQuestion() {

  }

}
