import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // might need to adjust baseURL to match backend
  baseURL = 'http://localhost:3000/games/';

  constructor(private http: HttpClient) { }

  createGame(player1Id: number, player2Id: number) {
    const inputToSend = {
      player1Id: player1Id,
      player2Id: player2Id
    }
    return this.http.post(`${this.baseURL}`, inputToSend);
  }

  updateGameWinner(winnerId: number, gameId: number) {
    const inputToSend = {
      winnerId: winnerId
    }
    return this.http.post(`${this.baseURL}${gameId}/winner`, inputToSend);
  }

  getGameParticipants(gameId: number) {
    return this.http.get(`${this.baseURL}${gameId}/participants`);
  }

  getGameWinner(gameId: number) {
    return this.http.get(`${this.baseURL}${gameId}/winner`);
  }

  getGameResult(gameId: number, myUserId: number) {
    return this.http.get(`${this.baseURL}${gameId}/${myUserId}/result`);
  }

  getPlayerStatistics(userId: number) {
    return this.http.get(`${this.baseURL}statistics/${userId}`);
  }

  challengeFriend(senderId: number, friendId: number) {
    return this.http.post(`${this.baseURL}challenge/${senderId}/${friendId}`, null);
  }


  getOwnGameInvites(userId: number) {
    return this.http.get(`${this.baseURL}myInvites/${userId}`);
  }

  declineChallenge(invitationId: number) {
    return this.http.post(`${this.baseURL}decline-invite/${invitationId}`, null);
  }

  acceptGameInvite(invitationId: number) {
    return this.http.post(`${this.baseURL}accept-invite/${invitationId}`, null);
  }

  getGameById(user1Id: number, user2Id: number) {
    return this.http.get(`${this.baseURL}getGameId/${user1Id}/${user2Id}`);
  }

  getQuestion(questionNumber: number, gameId: number) {
    return this.http.get(`${this.baseURL}getQuestion/${questionNumber}/${gameId}`);
  }

  getGameTurns(userId: number) {
    return this.http.get(`${this.baseURL}getGameTurns/${userId}`);
  }

}
