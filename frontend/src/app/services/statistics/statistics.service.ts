import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  // might need to adjust baseURL to match backend
  baseURL = 'http://localhost:3000/player/';

  constructor(private http: HttpClient) { }

  getPlayerStatistics(userId: number) {
    console.log('frontend userId: ' + userId);
    return this.http.get(`${this.baseURL}${userId}/statistics`);
  }

}
