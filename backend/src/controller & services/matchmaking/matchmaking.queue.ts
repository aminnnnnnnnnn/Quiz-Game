import { Socket } from 'socket.io';

export class MatchmakingQueue {
  private queue: Socket[] = [];

  enqueue(player: Socket) {
    this.queue.push(player);
    this.tryMatchPlayers();
  }

  private tryMatchPlayers() {
    if (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();
      // Emit matchFound events to the matched players
      player1.emit('matchFound');
      player2.emit('matchFound');
    }
  }
}
