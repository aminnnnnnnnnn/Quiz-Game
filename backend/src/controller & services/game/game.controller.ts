import {
    Controller,
    Post,
    Param,
    Body,
    Get,
    ParseIntPipe,
} from '@nestjs/common';
import {GameService} from './game.service';
import {GameInvitation} from '../../model/GameInvitation';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {
    }

    //ToDo: Überall noch Guards verwenden!

    @Get('myInvites/:userId')
    async getOwnGameInvites(@Param('userId') userId: number) {
        const result = await this.gameService.getOwnGameInvites(userId);
        return result;
    }

    @Post('create')
    async createGame(
        @Body('player1Id') player1Id: number,
        @Body('player2Id') player2Id: number,
    ) {
        const game = await this.gameService.createGame(player1Id, player2Id);
        return {game};
    }


    @Post('start')
    async startGame(
        @Body('player1Id') player1Id: number,
        @Body('player2Id') player2Id: number,
    ) {
        const messageResult = await this.gameService.startGame(
            player1Id,
            player2Id,
        );
        return {message: messageResult.message};
    }

    @Post('challenge/:senderId/:friendId')
    async challengeFriend(
        @Param('senderId', ParseIntPipe) senderId: number,
        @Param('friendId', ParseIntPipe) friendId: number,
    ): Promise<GameInvitation> {
        const invitation = await this.gameService.challengeFriend(
            senderId,
            friendId,
        );
        return invitation;
    }

    @Post('answer/:gameId/:questionId/:playerId/:selectedAnswer')
    async playerAnswerQuestion(
        @Param('gameId') gameId: number,
        @Param('questionId') questionId: number,
        @Param('playerId') playerId: number,
        @Param('selectedAnswer') selectedAnswer: number,
    ) {
        const game = await this.gameService.playerAnswerQuestion(
            gameId,
            questionId,
            playerId,
            selectedAnswer,
        );
        return {game};
    }

    @Get('getGameTurns/:userId')
    async getGameTurns(@Param('userId', ParseIntPipe) userId: number) {
        console.log("USERID " + userId);
        const result = await this.gameService.getGameTurns(userId);
        const username = result.username;
        const round = result.round;
        const question = result.question;
        const gameId = result.gameId;

        var data: any;

        if (round > 20) {
            data = null;
        } else {
            data = {
                username: username,
                round: round,
                question: question,
                gameId: gameId
            }
        }

        return data;
    }


    @Post('accept-invite/:invitationId')
    async acceptGameInvite(@Param('invitationId') invitationId: number) {
        const messageResult = await this.gameService.acceptGameInvite(invitationId);
        return {message: messageResult.message};
    }

    @Get(':gameId/:myUserId/result')
    async getGameResult(@Param('gameId', ParseIntPipe) gameId: number,
                        @Param('myUserId', ParseIntPipe) myUserId: number) {
        const result = await this.gameService.getGameResult(gameId, myUserId);
        ;

        const winnerUsername = result.winner;
        const myPoints = result.myPoints;
        const opponentPoints = result.opponentPoints;

        const data = {
            winnerUsername: winnerUsername,
            myPoints: myPoints,
            opponentPoints: opponentPoints
        }

        return data;
    }


    @Post('decline-invite/:invitationId')
    async declineGameInvite(@Param('invitationId') invitationId: number) {
        const messageResult = await this.gameService.declineGameInvite(
            invitationId,
        );
        return {message: messageResult.message};
    }

    @Get('getGameId/:user1Id/:user2Id')
    async getGameId(@Param('user1Id', ParseIntPipe) user1Id: number,
                    @Param('user2Id', ParseIntPipe) user2Id: number) {
        console.log("USERID1 " + user1Id);
        console.log("USERID2 " + user2Id);
        const result = await this.gameService.getGameId(user1Id, user2Id);
        return result;
    }

    @Get('getQuestion/:questionNumber/:gameId')
    async getQuestion1(@Param('questionNumber', ParseIntPipe) questionNumber: number,
                       @Param('gameId', ParseIntPipe) gameId: number) {
        const result = await this.gameService.getQuestion1(gameId);
        return result;
    }

}
