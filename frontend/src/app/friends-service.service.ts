import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private apiUrl = 'YOUR_API_ENDPOINT';  // Setzen Sie Ihre API-URL hier ein

  constructor(private http: HttpClient) { }

  getOnlineFriends(): Observable<any> {
    return this.http.get(`${this.apiUrl}/onlineFriends`);
  }
}
