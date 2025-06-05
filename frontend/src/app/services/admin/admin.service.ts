import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    // might need to adjust baseURL to match backend
    baseURL = 'http://localhost:3000/admin/';

    constructor(private http: HttpClient) {
    }

    getQuestion(question_id: number) {
        return this.http.get(`${this.baseURL}question/${question_id}`);
    }

    getAllQuestions() {
        return this.http.get(`${this.baseURL}questions`);
    }

    getAllQuestionByCategory(category_id: number) {
        return this.http.get(`${this.baseURL}questions/${category_id}`);
    }

    getCategory(category_id: number) {
        return this.http.get(`${this.baseURL}category/${category_id}`);
    }

    getAllCategories() {
        return this.http.get(`${this.baseURL}categories`);
    }

    // postQuestion(question: string, answer1: string, answer2: string, answer3: string, answer4: string, solution: number, categories: string[]) {
    //   const inputToSend = {
    //     question: question,
    //     answer1: answer1,
    //     answer2: answer2,
    //     answer3: answer3,
    //     answer4: answer4,
    //     solution: solution,
    //     categories: categories
    //   }
    //   return this.http.post(`${this.baseURL}/question`, inputToSend);
    // }

    postQuestion(input: any) {
        const inputToSend = {
            question: input.question,
            answer1: input.answer1,
            answer2: input.answer2,
            answer3: input.answer3,
            answer4: input.answer4,
            solution: input.solution,
        }
        return this.http.post(`${this.baseURL}question`, inputToSend);
    }

    postCategory(category: string) {
        const inputToSend = {
            category: category
        }
        return this.http.post(`${this.baseURL}category`, inputToSend);
    }

    updateQuestion(question_id: number, input: any) {
        const inputToSend = {
            question: input.question,
            answer1: input.answer1,
            answer2: input.answer2,
            answer3: input.answer3,
            answer4: input.answer4,
            solution: input.solution,
        }
        console.log(inputToSend)
        return this.http.put(`${this.baseURL}question/${question_id}`, inputToSend);
    }

    changeCategoryName(category_id: number, category: string) {
        const inputToSend = {
            category: category
        }
        return this.http.put(`${this.baseURL}category/${category_id}`, inputToSend);
    }

    deleteQuestion(question_id: number) {
        return this.http.delete(`${this.baseURL}question/${question_id}`);
    }

    deleteCategory(category_id: number) {
        return this.http.delete(`${this.baseURL}question/${category_id}`);
    }

}
