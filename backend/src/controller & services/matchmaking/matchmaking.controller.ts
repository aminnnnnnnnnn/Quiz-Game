import { Controller, Post, Body } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Post('join-queue')
  async joinMatchmakingQueue(@Body() playerData: any) {
    const user = await this.matchmakingService.enqueuePlayer(playerData);
    return { message: 'Joined matchmaking queue.', user };
  }
}
