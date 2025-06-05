import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MatchmakingGateway } from './matchmaking.gateway';

@Injectable()
export class MatchmakingService {
  private readonly matchmakingQueue: Socket[] = [];

  constructor(
    @Inject('matchmaking.gateway') private socketGateway: MatchmakingGateway,
  ) {}

  enqueuePlayer(playerData: any) {
    this.matchmakingQueue.push(playerData);
    this.tryMatchPlayers();

    return playerData;
  }

  private tryMatchPlayers() {
    while (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift();
      const player2 = this.matchmakingQueue.shift();
      const player1_id = player1.data;
      const player2_id = player2.data;
      this.emitMatchFoundEvent(player1_id);
      this.emitMatchFoundEvent(player2_id);
    }
  }

  private emitMatchFoundEvent(playerId: number) {
    const client = this.socketGateway.server.sockets.sockets[playerId];
    if (client) {
      client.emit('matchFound');
    }
  }
}
