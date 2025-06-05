import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {GameService} from './game.service';
import {UserService} from '../user/user.service';
import {Category} from '../../model/Category';
import {Game} from '../../model/Game';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {OnModuleInit, UnauthorizedException} from '@nestjs/common';
import {GetUserByIdDto} from '../../dto/GetUserByIdDto';
import {ConnectedUserService} from '../connected-user/connectedUserService';

@WebSocketGateway()
export class GameGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        private readonly gameService: GameService,
        private readonly userService: UserService,
        private connectedUserService: ConnectedUserService,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
    ) {
    }

    onModuleInit(): any {
        this.connectedUserService.deleteAll();
    }


    @SubscribeMessage('message')
    handleEvent(client: Socket, payload: { message: string }) {
        console.log('in backend');
        client.emit('message', payload);
    }

    @SubscribeMessage('getGames')
    async getGames(client: Socket) {
        const games = await this.gameRepository.findOne({
            where: {gameId: client.data.user_id},
        });
        client.emit('');
    }

    @SubscribeMessage('message')
    getMessage(@MessageBody() data: string) {
        console.log(data);
    }

    @SubscribeMessage('getUserId')
    getUserId(@MessageBody() socket: Socket, userId: number) {
        this.connectedUserService.create(socket.id, userId);
    }

    @SubscribeMessage('challengeFriend')
    async challengeFriend(client: Socket, payload: { friend_id: number }) {
        const {friend_id} = payload;
        const user = await this.userService.getUserById(client.data.user_id);

        if (!user) {
            client.emit('errorMessage', {message: 'User not found'});
            return;
        }
        const friend = await this.userService.getUserById(friend_id);
        if (!friend) {
            client.emit('errorMessage', {message: 'Friend not found'});
            return;
        }
        this.sendChallengeToFriend(user.username, friend.user_id);
        client.emit('challengeAccepted', {
            message: 'Challenge sent successfully',
        });
    }

    async handleConnection(socket: Socket) {
        try {
            const res: GetUserByIdDto = await this.userService.getUserById(
                socket.handshake.auth.token,
            );

            console.log("res " + res)
            await this.connectedUserService.create(socket.id, socket.handshake.auth.token);
            // return this.server.to(socket.id).emit('challengeFriend');
        } catch (e) {
            console.log(e);
            return this.disconnect(socket);
        }
    }

    private disconnect(socket: Socket) {
        socket.emit('Error', new UnauthorizedException());
        socket.disconnect();
    }


    private async sendChallengeToFriend(
        challenger: string,
        friendUserId: number,
    ): Promise<void> {
        const friendConnection = await this.connectedUserService.findByUser(
            friendUserId,
        );
        if (friendConnection) {
            const friendSocketId = friendConnection.socketId;
            this.server
                .to(friendSocketId)
                .emit('challengeReceived', {challenger: challenger});
        }
    }

    @SubscribeMessage('loadPlayerGameInvites')
    async loadPlayerGameInvites(@MessageBody() friendId: number) {
        console.log("in loadPlayerGameInvites " + friendId);
        try {
            const invites = await this.gameService.getPlayerGameInvites(friendId);

            console.log("invites " + invites);

            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx " + await this.connectedUserService.findByUser(friendId));

            const x = this.connectedUserService.findByUser(friendId);


            const friendSocketId = (await x).socketId;

            console.log("friendSocketId " + friendSocketId);

            console.log(invites);
            this.server.to(friendSocketId).emit('loadPlayerGameInvites', invites);
        } catch (error) {
            console.error(error);
            //this.server.to(friendSocketId).emit('error', 'Failed to load game invites.');
        }
    }

    @SubscribeMessage('connected')
    async getConnectedUsers(@MessageBody() data: any) {
        console.log("in getConnectedUsers " + data);
        try {
            const connectedUsers = await this.connectedUserService.getAllConnectedUsers();
            console.log(connectedUsers);
            this.server.emit('connected', connectedUsers);
        } catch (error) {
            console.error(error);
        }
    }

    @SubscribeMessage('acceptFriendChallenge')
    async acceptFriendChallenge(client: Socket, payload: { friend_id: number }) {
        const {friend_id} = payload;
        const user = await this.userService.getUserById(client.data.user_id);
        if (!user) {
            client.emit('errorMessage', {message: 'User not found'});
            return;
        }
        const friend = await this.userService.getUserById(friend_id);

        if (!friend) {
            client.emit('errorMessage', {message: 'Friend not found'});
            return;
        }
        client.emit('challengeAccepted', {
            message: 'Challenge accepted successfully',
        });

        await this.gameService.startGame(user.user_id, friend.user_id);
    }

    @SubscribeMessage('playerAnswered')
    async playerAnswered(
        @MessageBody() data: { buttonNumber: number, userId: number, gameId: number }
    ) {
        console.log("USERID " + data.userId +" " + data.gameId);
        const answer = await this.gameService.playerAnswered(data.buttonNumber, data.userId, data.gameId);
        const question = answer.question;
        const friendId = answer.otherUser;
        const questionNumber = answer.questionNumber;
        const gameId = answer.gameId;
        const username = answer.username;
        const round = answer.round;

        const x = this.connectedUserService.findByUser(friendId);

        const friendSocketId = (await x).socketId;


        const toSend = {
            question: question,
            questionNumber: questionNumber,
            gameId: gameId,
            username: username,
            round: round
        }

        this.server.to(friendSocketId).emit('playerAnswered', toSend);
    }


    @SubscribeMessage('getRandomQuestionByCategory')
    async getRandomQuestionByCategory(client: Socket) {
        try {
            const randomQuestion = await this.gameService.getRandomQuestion(
            );
            if (randomQuestion) {
                client.emit('randomQuestion', randomQuestion);
            } else {
                client.emit('errorMessage', {
                    message: 'No question found for the category.',
                });
            }
        } catch (error) {
            client.emit('errorMessage', {message: error.message});
        }
    }

    handleDisconnect(client: Socket): void {
        client.emit('Disconnection', {
            message:
                'You or your opponent disconnected from the server, returning to matchmaking.',
        });
        this.connectedUserService.deleteBySocketId(client.id);
        client.disconnect();
    }


    @SubscribeMessage('loadQuestion')
    loadQuestion(@MessageBody() client: Socket) {
        console.log("load Question income Server");
        //const question: string = "receive Question funktioniert! Geil!";
        client.emit('receiveQuestion', {test});
        //console.log("receive Question Emit Server");
    }


}
