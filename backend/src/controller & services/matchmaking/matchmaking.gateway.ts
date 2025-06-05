import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchmakingQueue } from './matchmaking.queue';

@WebSocketGateway()
export class MatchmakingGateway implements OnGatewayConnection {
  private readonly matchmakingQueue = new MatchmakingQueue();

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const player_id = client.handshake.query.player_id;
    client.data = { player_id };
    this.matchmakingQueue.enqueue(client);
  }
}
