import {EventEmitter, Injectable, Output} from '@angular/core';
import io from 'socket.io-client';

import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import {PlayComponent} from "../../play/play.component";


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  myUserId: number = 0;
  socket: any;

  readonly uri: string = "http://localhost:3000"; // uri of our socket.io server

  constructor() {

    if (localStorage.getItem("userId") != null) {
      this.myUserId = parseInt(localStorage.getItem("userId")!);
    }

    this.socket = io(this.uri, {
        auth: {
            token: localStorage.getItem("userId")
        }
    });
  }

  ngOnInit(): void {
    //this.socket.handshake.token = localStorage.getItem("userId");
  }

  //Echtzeit Laden der Einladungen, wenn Freund Spieleanfrage schickt
  loadPlayerInvites() {
    return new Observable(observer => {
      this.socket.on('loadPlayerGameInvites', (data: any[]) => {
        observer.next(data);
      });
    })
  }

  emitConnect() {
    this.socket.emit('connected', this.socket);
  }

  onConnect() {
    return new Observable(observer => {
      this.socket.on('connected', (data: any) => {
        console.log("onConnect: " + JSON.stringify(data));
        console.log(data);
        observer.next(data);
      });
    })
  }

  emitPlayerAnswered(buttonNumber: number, userId: number, gameId: number) {
    const data = {
      buttonNumber: buttonNumber,
      userId: userId,
      gameId: gameId
    }
    this.socket.emit('playerAnswered', data);
  }

  onPlayerAnswered() {
    return new Observable(observer => {
      this.socket.on('playerAnswered', (data: any) => {
        observer.next(data);
      });
    })
  }

  emitLoadPlayerGameInvites(friendId: number) {
    this.socket.emit('loadPlayerGameInvites', friendId);
  }


  //Empfangen der Frage vom Server
  receiveQuestion() {
      return new Observable(observer => {
        this.socket.on('receiveQuestion', (data: any) => {
          observer.next(data);
        });
      })


  }
}
