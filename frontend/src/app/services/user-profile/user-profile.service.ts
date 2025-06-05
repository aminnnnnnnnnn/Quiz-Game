import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  // might need to adjust baseURL to match backend
  baseURL = 'http://localhost:3000/user/';

  constructor(private http: HttpClient) { }

  getUserProfile(userId: number) {
    return this.http.get(this.baseURL + userId);
  }

  updateUserProfile(userId: number, username: string, email: string, password: string) {
    return this.http.put(this.baseURL + userId, {username: username, email: email, password: password});
  }
}
