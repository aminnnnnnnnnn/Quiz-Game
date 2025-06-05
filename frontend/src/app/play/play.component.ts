import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user/user.service";
import {GameService} from "../services/game/game.service";
import {SocketService} from "../services/socket/socket.service";
import {io} from "socket.io-client";
import {Socket} from "ngx-socket-io";


interface Friend {
    user_id: number;
    username: string;
}

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

    constructor(private router: Router,
                private userService: UserService,
                private gameService: GameService,
                private socketService: SocketService) {

    }

    myUserId: number = 0;
    success: boolean = false;
    error: boolean = false;
    responseMessage: string = "";

    friends: Friend[] = [];
    gameRequests: any = [];
    myTurns: any = [];
    friendUserId: number = 0;
    gameId: number = 0;

    showMenu: boolean = true;
    showGame: boolean = false;

    question: any;

    input: any;
    round: any;

    ngOnInit() {

        if (localStorage.getItem("userId") != null) {
            this.myUserId = parseInt(localStorage.getItem("userId")!);
        } else {
            this.toLogin();
        }
        setTimeout(() => {
            this.getFriends();
        }, 500);

        //Beim Laden der Seite werden die eigenen Game Invites ausgegeben
        this.getOwnGameInvites(this.myUserId);




        //Funktionen ausgelagert, damits schöner ist. Das sind Load Invite subscriber und receive Question subscriber
        this.loadPlayerInvites();
        //this.receiveQuestion();
        this.onPlayerAnswered();
        this.getGameTurns();
        this.getConnectedUsers();
    }

    loadPlayerInvites() {
        //ToDo: Beim laden der Play Seite und connecten zum socket, müssen bereits alle afragen geladen werden
        this.socketService.loadPlayerInvites().subscribe(data => {
            this.gameRequests = data;
        });
    }

    emitConnect() {
        this.socketService.emitConnect();
    }

    onPlayerAnswered() {
        this.socketService.onPlayerAnswered().subscribe(data => {

            this.input = data;

            const questionNumber = this.input.questionNumber;
            const gameId = this.input.gameId;
            this.gameId = this.input.gameId;
            const question = this.input.question;
            const username = this.input.username;
            const round = this.input.round;
            this.round = round;

            this.myTurns.push({
                username: username,
                gameId: gameId,
                question: question,
                round: round
            })


        });
    }

    getConnectedUsers() {
        this.socketService.onConnect().subscribe(data => {
            console.log(JSON.stringify(data));
        });
    }

    getGameTurns() {
        this.gameService.getGameTurns(this.myUserId).subscribe((data: any) => {

            const username = data.username;
            const gameId = data.gameId;
            const question = data.question;
            const round = data.round;

            if (username != null) {
                this.myTurns.push({
                    username: username,
                    gameId: gameId,
                    question: question,
                    round: round
                })
            }
            //this.myTurns = data;
        }, (error: any) => {
            console.log(error);
        });
    }

    loadQuestion(gameId: number) {
        this.gameService.getQuestion(1, gameId).subscribe((data: any) => {
            this.question = data;

            //this.makeGameTurn(data);

        }, (error: any) => {
            console.log(error);
        });

        //this.getButtonClicked(5);
    }



    declineGameInvite(invitationId: number) {
        this.gameService.declineChallenge(invitationId).subscribe((data: any) => {
            this.getOwnGameInvites(this.myUserId);
        }, (error: any) => {
            console.log(error);
        });
    }

    makeGameTurn(question: any, gameId: number) {

        for (let i = 0; i < this.myTurns.length; i++) {
            if (this.myTurns[i].gameId === this.gameId) {
                this.myTurns.splice(i, 1);
            }
        }

        this.question = question;
        this.gameId = gameId;
        this.showMenu = false;
        this.showGame = true;
    }

    acceptGameInvite(invite: any) {
        const inviteId = invite.id;
        this.gameService.acceptGameInvite(inviteId).subscribe((data: any) => {
            this.friendUserId = invite.senderIdUserId;

            this.gameService.getGameById(this.myUserId, this.friendUserId).subscribe((data: any) => {
                this.gameId = data[0].gameId;
                setTimeout(() => {
                    this.loadQuestion(this.gameId);
                    this.showMenu = false;
                    this.showGame = true;
                }, 100);

                for (let i = 0; i < this.gameRequests.length; i++) {
                    if (this.gameRequests[i].id === inviteId) {
                        this.gameRequests.splice(i, 1);
                    }
                }

            }, (error: any) => {
                console.log(error);
            });

        }, (error: any) => {
            console.log(error);
        });
    }

    getOwnGameInvites(userId: number) {
        this.gameService.getOwnGameInvites(userId).subscribe((data: any) => {
            this.gameRequests = data;
        }, (error: any) => {
            console.log(error);
        });
    }

    getButtonClicked(buttonNumber: number) {
        this.socketService.emitPlayerAnswered(buttonNumber, this.myUserId, this.gameId);

        setTimeout(() => {
          this.showMenu = true;
          this.showGame = false;
        }, 2000);


        for (let i = 0; i < this.myTurns.length; i++) {
            if (this.myTurns[i].gameId === this.gameId) {
                this.myTurns.splice(i, 1);
            }
        }

        if (this.round === 19 || this.round === 20) {
          this.goToStatistics();
        }

    }

    goToStatistics() {
        this.router.navigate(['/statistics']);
    }

    getFriends() {

        this.userService.getFriends(this.myUserId).subscribe((data: any) => {

            if (!data) {
                this.responseMessage = data.message;
                this.success = false;
                this.error = true;
                return;
            } else {
                this.friends = [];
                this.responseMessage = data.message;
                this.success = true;
                this.error = false;
                this.friends = data;

                for (let i = 0; i < data.length; i++) {
                    this.friends[i].username = data[i].username;
                    this.friends[i].user_id = data[i].user_id;
                }

            }
        }, (error: any) => {
            this.responseMessage = error.error.message;
            this.success = false;
            this.error = true;
        });

    }

    challengeFriend(friendId: number) {
        this.gameService.challengeFriend(this.myUserId, friendId).subscribe((data: any) => {
            this.socketService.emitLoadPlayerGameInvites(friendId);
        }, (error: any) => {
            console.log(error);
        });
    }

    toLogin() {
        this.router.navigate(['/']);
    }
}
