import {Question} from "../model/Question";

export class GetQuestionDto{
    question: Question;

    constructor(question: Question) {
        this.question = question;
    }
}