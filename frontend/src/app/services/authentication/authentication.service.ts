import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // might need to adjust baseURL to match backend
  baseURL = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  // need to adjust the URLs to match backend

  login(email: string, password: string) {
    const inputToSend = {
      email: email,
      password: password
    }
    return this.http.post(`${this.baseURL}login`, inputToSend);
  }

  logout() {
    return this.http.post(`${this.baseURL}logout`, null);
  }

  checkLogin() {
    return this.http.get(`${this.baseURL}checkLogin`);
  }
}
