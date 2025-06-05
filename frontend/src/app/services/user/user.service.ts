import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // might need to adjust baseURL to match backend
  baseURL = 'http://localhost:3000/user/';

  constructor(private http: HttpClient) { }

  postUser(username: string, password:string, email: string) {
    const inputToSend = {
      username: username,
      password: password,
      email: email
    }
    return this.http.post(`${this.baseURL}`, inputToSend);
  }

  getUser(user_id: number) {
    return this.http.get(`${this.baseURL}${user_id}`);
  }

  addFriend(user_id: number, username: string) {
    return this.http.post(`${this.baseURL}add-friend/${user_id}/${username}`, {});
  }

  editUser(username: string, email: string) {
    const inputToSend = {
      username: username,
      email: email
    }
    return this.http.put(`${this.baseURL}`, inputToSend);
  }

  deleteUser(user_id: number) {
    return this.http.delete(`${this.baseURL}${user_id}`);
  }

  getFriends(user_id: number) {
    return this.http.get(`${this.baseURL}friends/${user_id}`);
  }

  deleteFriend(user_id: number) {
    return this.http.delete(`${this.baseURL}friends/${user_id}`);
  }
}
