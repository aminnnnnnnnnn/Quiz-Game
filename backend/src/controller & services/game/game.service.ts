import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Game} from '../../model/Game';
import {EntityManager, Repository} from 'typeorm';
import {MessageResultDto} from '../../dto/MessageResultDto';
import {Question} from '../../model/Question';
import {Category} from '../../model/Category';
import {User} from '../../model/User';
import {UserService} from '../user/user.service';
import {GameInvitation} from '../../model/GameInvitation';

@Injectable()
export class GameService {
    private readonly categoryRepository: Repository<Category>;

    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(GameInvitation)
        private readonly invitationRepository: Repository<GameInvitation>,
        @InjectRepository(GameInvitation)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(GameInvitation)
        private readonly gameInvitaionRepository: Repository<GameInvitation>,
        private readonly userService: UserService,
        //private entityManager: EntityManager
    ) {
        //this.gameRepository = entityManager.getRepository(Game);
    }

    async createGame(
        player1Id: number,
        player2Id: number,
        winner: number | null = null,
    ): Promise<Game> {
        const game = new Game();
        game.player1.user_id = player1Id;
        game.player2.user_id = player2Id;
        //game.winner.user_id = winner;
        return this.gameRepository.save(game);
    }

    async getRound(gameId: number) {
        const roundObject = await this.gameRepository.query(
            `SELECT round
             FROM game
             WHERE gameId = ${gameId};`);
        const round = roundObject[0].round;
        return round;
    }

    async playerAnswered(buttonNumber: number, userId: number, gameId: number) {


        const p1Idobject = await this.gameRepository.query(`
            SELECT player1Id
            FROM game
            WHERE gameId = ${gameId}`);

        const p2Idobject = await this.gameRepository.query(`
            SELECT player2Id
            FROM game
            WHERE gameId = ${gameId}`);

        const p1Id = p1Idobject[0].player1Id;
        const p2Id = p2Idobject[0].player2Id;


        const currentUserObject = await this.userRepository.query(
            `SELECT currentPlayerId
             FROM game
             WHERE gameId = ${gameId}`);

        const currentUser = currentUserObject[0].currentPlayerId;


        const roundObject = await this.gameRepository.query(
            `SELECT round
             FROM game
             WHERE gameId = ${gameId}`);

        const round = roundObject[0].round;


        var questionIdObject: any;
        var questionId: number = 0;


        if (round == 2 || round == 3) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question1
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question1;
        } else if (round == 4 || round == 5) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question2
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question2;
        } else if (round == 6 || round == 7) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question3
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question3;
        } else if (round == 8 || round == 9) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question4
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question4;
        } else if (round == 10 || round == 11) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question5
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question5;
        } else if (round == 12 || round == 13) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question6
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question6;
        } else if (round == 14 || round == 15) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question7
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question7;
        } else if (round == 16 || round == 17) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question8
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question8;
        } else if (round == 18 || round == 19) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question9
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question9;
        } else if (round == 20 || round == 21) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question10
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question10;
        } else if (round > 21) {
            questionIdObject = await this.gameRepository.query(
                `SELECT question10
                 FROM game
                 WHERE gameId = ${gameId}`);
            questionId = questionIdObject[0].question10;
        }


        const correctAnswerObject = await this.questionRepository.query(
            `SELECT solution
             FROM question
             WHERE questionId = ${questionId}`);

        const correctAnswer = correctAnswerObject[0].solution;


        var isUser1 = false;
        var isUser2 = false;

        if (currentUser == p1Id) {
            isUser1 = true;
        } else {
            isUser2 = true;
        }


        if (correctAnswer == buttonNumber) {
            if (isUser1) {
                await this.gameRepository.query(
                    `UPDATE game
                     SET player1Score = player1Score + 1
                     WHERE gameId = ${gameId}`);
            }
            if (isUser2) {
                await this.gameRepository.query(
                    `UPDATE game
                     SET player2Score = player2Score + 1
                     WHERE gameId = ${gameId}`);
            }
        }


        if (round > 20) {

            await this.gameRepository.query(
                `UPDATE game
                 SET finished = true
                 WHERE gameId = ${gameId}`);

            const player1ScoreObject = await this.gameRepository.query(
                `SELECT player1Score
                 FROM game
                 WHERE gameId = ${gameId}`);

            const player2ScoreObject = await this.gameRepository.query(
                `SELECT player2Score
                 FROM game
                 WHERE gameId = ${gameId}`);

            const player1Score = player1ScoreObject[0].player1Score;
            const player2Score = player2ScoreObject[0].player2Score;


            if (player1Score > player2Score) {
                await this.gameRepository.query(
                    `UPDATE game
                     SET winnerId = ${p1Id}
                     WHERE gameId = ${gameId}`);
            } else if (player2Score > player1Score) {
                await this.gameRepository.query(
                    `UPDATE game
                     SET winnerId = ${p2Id}
                     WHERE gameId = ${gameId}`);
            } else {
                await this.gameRepository.query(
                    `UPDATE game
                     SET winnerId = -1
                     WHERE gameId = ${gameId}`);
            }


        } else {

            const newCurrentPlayerObject = await this.gameRepository.query(
                `SELECT currentPlayerId
                 FROM game
                 WHERE gameId = ${gameId}`);
            const newCurrentPlayer = newCurrentPlayerObject[0].currentPlayerId;

            if (newCurrentPlayer != userId) {
                await this.gameRepository.query(
                    `UPDATE game
                     SET round = round
                     WHERE gameId = ${gameId}`);
            } else {
                await this.gameRepository.query(
                    `UPDATE game
                     SET round = round + 1
                     WHERE gameId = ${gameId}`);
            }

//hier ist der fehler


            if (currentUser == p1Id) {
                await this.gameRepository.query(
                    `UPDATE game
                     SET currentPlayerId = ${p2Id}
                     WHERE gameId = ${gameId}`);
            } else {
                await this.gameRepository.query(
                    `UPDATE game
                     SET currentPlayerId = ${p1Id}
                     WHERE gameId = ${gameId}`);
            }


            var newQuestionIdObject;
            var newQuestionId: number = 0;

            var questionNumber = 0;

            if (round == 1 || round == 2) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question1
                     FROM game
                     WHERE gameId = ${gameId}`);
                newQuestionId = newQuestionIdObject[0].question1;
                questionNumber = 1;
            } else if (round == 3 || round == 4) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question2
                     FROM game
                     WHERE gameId = ${gameId}`);
                newQuestionId = newQuestionIdObject[0].question2;
                questionNumber = 2;
            } else if (round == 5 || round == 6) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question3
                     FROM game
                     WHERE gameId = ${gameId}`);
                newQuestionId = newQuestionIdObject[0].question3;
                questionNumber = 3;
            } else if (round == 7 || round == 8) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question4
                     FROM game
                     WHERE gameId = ${gameId}`);
                newQuestionId = newQuestionIdObject[0].question4;
                questionNumber = 4;
            } else if (round == 9 || round == 10) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question5
                     FROM game
                     WHERE gameId = ${gameId}`);
                questionNumber = 5;
                newQuestionId = newQuestionIdObject[0].question5;
            } else if (round == 11 || round == 12) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question6
                     FROM game
                     WHERE gameId = ${gameId}`);
                questionNumber = 6;
                newQuestionId = newQuestionIdObject[0].question6;
            } else if (round == 13 || round == 14) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question7
                     FROM game
                     WHERE gameId = ${gameId}`);
                newQuestionId = newQuestionIdObject[0].question7;
                questionNumber = 7;
            } else if (round == 15 || round == 16) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question8
                     FROM game
                     WHERE gameId = ${gameId}`);
                newQuestionId = newQuestionIdObject[0].question8;
                questionNumber = 8;
            } else if (round == 17 || round == 18) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question9
                     FROM game
                     WHERE gameId = ${gameId}`);
                newQuestionId = newQuestionIdObject[0].question9;
                questionNumber = 9;
            } else if (round == 19 || round == 20) {
                newQuestionIdObject = await this.gameRepository.query(
                    `SELECT question10
                     FROM game
                     WHERE gameId = ${gameId}`);
                newQuestionId = newQuestionIdObject[0].question10;
                questionNumber = 10;
            }


            const questionToReturn = await this.questionRepository.query(
                `SELECT *
                 FROM question
                 WHERE questionId = ${newQuestionId}`);

            //const questionToReturn = questionToReturnObject[0].question;


            const otherUserObject = await this.gameRepository.query(
                `SELECT currentPlayerId
                 FROM game
                 WHERE gameId = ${gameId}`);

            const otherUser = otherUserObject[0].currentPlayerId;


            const unsernameObject = await this.userRepository.query(
                `SELECT username
                 FROM user
                 WHERE user_id = ${userId}`);

            const username = unsernameObject[0].username;


            const data = {
                question: questionToReturn,
                otherUser: otherUser,
                questionNumber: questionNumber,
                gameId: gameId,
                username: username,
                round: round
            }


            return data;
        }
        return {
            question: newQuestionIdObject[0].question1,
            otherUser: null,
            questionNumber: null,
            gameId: null,
            username: null,
            round: null
        };
    }

    /*
          async challengeFriend(
              senderId: number,
              friendId: number,
          ): Promise<GameInvitation> {
              const senderExists = await this.userService.getUserById(senderId);
              const friendExists = await this.userService.getUserById(friendId);

              if (!senderExists || !friendExists) {
                  throw new Error('Sender or friend not found');
              }


         try {
                  const invitation = new GameInvitation();
                  invitation.sender_id = senderId;
                  invitation.friend_id = friendId;
                  invitation.senderUsername = senderExists.username;
                  await this.invitationRepository.save(invitation);
                  return invitation;
          } catch (e) {
             throw new Error(e);
         }
          }
      */

    async challengeFriend(
        senderId: number,
        friendId: number,
    ): Promise<GameInvitation> {
        const senderExists = await this.userService.getUserById(senderId);
        const friendExists = await this.userService.getUserById(friendId);

        if (!senderExists || !friendExists) {
            throw new Error('Sender or friend not found');
        }

        const gameAlreadyExists: Game[] =
            await this.gameRepository.query(
                `SELECT *
                 FROM game
                 WHERE ((player1Id = ${friendId} AND player2Id = ${senderId})
                     OR (player1Id = ${senderId} AND player2Id = ${friendId}))
                   AND finished = 0;`,
            );


        if (gameAlreadyExists.length != 0) {
            throw new HttpException(
                'Game already exists, wait for accept or decline his request.',
                HttpStatus.FORBIDDEN,
            );
        }

        const alreadyExists: GameInvitation[] =
            await this.gameInvitaionRepository.query(
                `SELECT *
                 FROM game_invitation
                 WHERE (friendIdUserId = ${friendId} AND senderIdUserId = ${senderId})
                    OR (friendIdUserId = ${senderId} AND senderIdUserId = ${friendId});`,
            );

        if (alreadyExists.length === 0) {

            const invitation = new GameInvitation();
            invitation.sender_id = senderId;
            invitation.friend_id = friendId;
            invitation.senderUsername = senderExists.username;
            await this.invitationRepository.save(invitation);
            return invitation;
        } else {
            throw new HttpException(
                'User already challenged, wait for accept or accept his request.',
                HttpStatus.FORBIDDEN,
            );
        }
    }

    async getGameId(user1Id: number, user2Id: number) {
        const game = await this.gameRepository.query(
            `SELECT *
             FROM game
             WHERE ((player1Id = ${user1Id} AND player2Id = ${user2Id})
                 OR (player1Id = ${user2Id} AND player2Id = ${user1Id}))
               AND finished != 1;`,
        );
        if (!game) {
            throw new Error('Game not found');
        }
        return game;
    }

    async getGameTurns(userId: number) {

        const gameIdObject = await this.gameRepository.query(
            `SELECT gameId
             FROM game
             WHERE ((player1Id = ${userId} OR player2Id = ${userId})
               AND currentPlayerId = ${userId}) AND finished = 0;`,
        );
        if (!gameIdObject) {
            throw new Error('Game not found');
        }
        const gameId = gameIdObject[0].gameId;

        const game = await this.gameRepository.query(
            `SELECT *
             FROM game
             WHERE gameId = ${gameId};`);


        const user1 = game[0].player1Id;
        const user2 = game[0].player2Id;

        var friendId = 0;

        if (user1 == userId) {
            friendId = user2;
        } else {
            friendId = user1;
        }

        const usernameObject = await this.userRepository.query(
            `SELECT username
             FROM user
             WHERE user_id = ${friendId};`,
        );


        const username = usernameObject[0].username;


        const roundObject = await this.gameRepository.query(
            `SELECT round
             FROM game
             WHERE (gameID = ${gameId});`);
        const round = roundObject[0].round;


        var questionObject: any;
        var question: any;


        if (round == 1 || round == 2) {
            questionObject = await this.gameRepository.query(
                `SELECT question1
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question1;
        } else if (round == 3 || round == 4) {
            questionObject = await this.gameRepository.query(
                `SELECT question2
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question2;
        } else if (round == 5 || round == 6) {
            questionObject = await this.gameRepository.query(
                `SELECT question3
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question3;
        } else if (round == 7 || round == 8) {
            questionObject = await this.gameRepository.query(
                `SELECT question4
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question4;
        } else if (round == 9 || round == 10) {
            questionObject = await this.gameRepository.query(
                `SELECT question5
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question5;
        } else if (round == 11 || round == 12) {
            questionObject = await this.gameRepository.query(
                `SELECT question6
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question6;
        } else if (round == 13 || round == 14) {
            questionObject = await this.gameRepository.query(
                `SELECT question7
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question7;
        } else if (round == 15 || round == 16) {
            questionObject = await this.gameRepository.query(
                `SELECT question8
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question8;
        } else if (round == 17 || round == 18) {
            questionObject = await this.gameRepository.query(
                `SELECT question9
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question9;
        } else if (round == 19 || round == 20) {
            questionObject = await this.gameRepository.query(
                `SELECT question10
                 FROM game
                 WHERE (gameID = ${gameId});`);
            question = questionObject[0].question10;
        }

        const newQuestionObject = await this.questionRepository.query(
            `SELECT *
             FROM question
             WHERE questionId = ${question};`);


        const data = {
            username: username,
            question: newQuestionObject,
            round: round,
            gameId: gameId
        }

        return data;
    }

    async playerAnswerQuestion(
        gameId: number,
        questionId: number,
        player_id: number,
        selectedAnswer: number,
    ): Promise<Game> {
        const game = await this.gameRepository.findOne({
            where: {gameId: gameId},
        });

        if (!game) {
            throw new Error('Game not found');
        }
        // if (game.currentQuestion.questionId !== questionId) {
        //   throw new Error('Question is not the current question');
        //}
        const question = await this.questionRepository.findOne({
            where: {questionId: questionId},
        });
        if (!question) {
            throw new Error('Question not found');
        }
        if (question.solution === selectedAnswer) {
            if (game.currentPlayer === game.player1) {
                game.player1Score += 1;
            } else if (game.currentPlayer === game.player2) {
                game.player2Score += 1;
            }
        }
        //game.currentQuestion = await this.getRandomQuestionByCategory();
        await this.gameRepository.save(game);
        return game;
    }

    async getRandomQuestion(): Promise<Question | null> {
        const question = await this.questionRepository.query(
            `SELECT *
             FROM question
             ORDER BY RANDOM()
             LIMIT 1;`,
        );
        return question;
    }

    async getGameResult(gameId: number, myUserId: number) {
        const winnerObject = await this.gameRepository.query(
            `SELECT winnerId
             FROM game
             WHERE gameId = ${gameId};`,);

        const winnerId = winnerObject[0].winnerId;

        const player1PointsObject = await this.gameRepository.query(
            `SELECT player1Score
             FROM game
             WHERE gameId = ${gameId};`,);
        const player1Points = player1PointsObject[0].player1Score;

        const player2PointsObject = await this.gameRepository.query(
            `SELECT player2Score
             FROM game
             WHERE gameId = ${gameId};`,);
        const player2Points = player2PointsObject[0].player2Score;

        const winnerUsernameObject = await this.userRepository.query(
            `SELECT username
             FROM user
             WHERE user_id = ${winnerId};`,);
        const winnerUsername = winnerUsernameObject[0].username;

        const player1IdObject = await this.gameRepository.query(
            `SELECT player1Id
             FROM game
             WHERE gameId = ${gameId};`,);
        const player1Id = player1IdObject[0].player1Id;

        var myPoints = 0;
        var opponentPoints = 0;

        if (player1Id == myUserId) {
            myPoints = player1Points;
            opponentPoints = player2Points;
        } else {
            myPoints = player2Points;
            opponentPoints = player1Points;
        }


        const data = {
            winner: winnerUsername,
            myPoints: myPoints,
            opponentPoints: opponentPoints
        }

        return data;
    }

    async startGame(
        player1Id: number,
        player2Id: number,
    ): Promise<MessageResultDto> {
        try {
            const rounds = 10;
            const category_id = 1;
            const player1: User | null = await this.userRepository.findOneBy({
                user_id: player1Id,
            });
            const player2: User | null = await this.userRepository.findOneBy({
                user_id: player2Id,
            });

            if (!player1 || !player2) {
                throw new Error('One or both players not found');
            }
            let currentPlayer = player2;


            const game = new Game();
            game.player1 = player1;
            game.player2 = player2;
            game.winner = null;
            game.round = 1;
            game.currentPlayer = currentPlayer;
            game.questions = [];

            //question 1-10
            game.question1 = 0;
            game.question2 = 0;
            game.question3 = 0;
            game.question4 = 0;
            game.question5 = 0;
            game.question6 = 0;
            game.question7 = 0;
            game.question8 = 0;
            game.question9 = 0;
            game.question10 = 0;


            const questions: Question[] = [];

            var i = 0;
            while (i < 10) {
                const randomQuestion = await this.getRandomQuestion(

                );

                questions.push(randomQuestion);
                i++;

            }

            game.question1 = questions[0][0].questionId
            game.question2 = questions[1][0].questionId
            game.question3 = questions[2][0].questionId
            game.question4 = questions[3][0].questionId
            game.question5 = questions[4][0].questionId
            game.question6 = questions[5][0].questionId
            game.question7 = questions[6][0].questionId
            game.question8 = questions[7][0].questionId
            game.question9 = questions[8][0].questionId
            game.question10 = questions[9][0].questionId

            await this.gameRepository.save(game);

            return new MessageResultDto('Spiel angelegt!');
        } catch (error) {
            throw error;
        }
    }

    async getPlayerGameInvites(userId: number): Promise<GameInvitation[]> {
        try {
            const myinvites = await this.gameInvitaionRepository.query(
                `SELECT *
                 FROM game_invitation
                 WHERE friendIdUserId = ${userId};`,
            );


            return myinvites;
        } catch (error) {
            throw new Error('Failed to get game invites for the user.');
        }
    }

    async getOwnGameInvites(userId: number): Promise<GameInvitation[]> {
        try {
            const myInvites = await this.gameInvitaionRepository.query(
                `SELECT *
                 FROM game_invitation
                 WHERE friendIdUserId = ${userId};`,
            );
            return myInvites;
        } catch (e) {
            throw new NotFoundException('No invites found!');
        }
    }

    async getQuestion1(gameId: number): Promise<Question> {


        const roundsObject = await this.gameRepository.query(
            `SELECT round
             FROM game
             WHERE gameId = ${gameId}`);

        const rounds = roundsObject[0].round;


        const currentGameQuestion1 = await this.questionRepository.query(
            `SELECT [question1]
             FROM game
             WHERE gameId = ${gameId}`);

        if (!currentGameQuestion1) {
            throw new Error('Question not found!');
        }


        const question = await this.questionRepository.query(
            `SELECT *
             FROM question
             WHERE questionId = ${currentGameQuestion1[0].question1};`);


        await this.gameRepository.query(
            `UPDATE game
             SET round = round + 1
             WHERE gameId = ${gameId}`);


        if (rounds > 19) {
            return null;
        }

        return question;
    }


    async acceptGameInvite(invitationId: number): Promise<MessageResultDto> {


        const invitation = await this.invitationRepository.query(
            `SELECT *
             FROM game_invitation
             WHERE id = ${invitationId};`
        );


        if (!invitation) {
            throw new Error('Einladung nicht gefunden');
        }


        await this.startGame(invitation[0].senderIdUserId, invitation[0].friendIdUserId);
        await this.invitationRepository.delete(invitationId);
        /*
                await this.invitationRepository.query(
                    `DELETE FROM game_invitation WHERE id = ${invitationId};`
                );*/
        return new MessageResultDto('game will start soon!');
    }

    async declineGameInvite(invitationId: number): Promise<MessageResultDto> {
        const invitation = await this.invitationRepository.findOne({
            where: {id: invitationId},
        });
        if (!invitation) {
            throw new Error('Einladung nicht gefunden');
        }
        await this.invitationRepository.delete(invitationId);
        return new MessageResultDto('Game was declined.');
    }
}
