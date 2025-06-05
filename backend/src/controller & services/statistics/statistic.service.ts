import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../model/User';
import { Game } from '../../model/Game';
import { GetPlayerStatisticsDto } from '../../dto/GetPlayerStatisticsDto';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  async getPlayerStatistics(userId: number): Promise<GetPlayerStatisticsDto[]> {
    console.log('test');
    const playerGames = await this.gameRepository
        .createQueryBuilder('game')
        .where(
            'game.player1 = :userId OR game.player2 = :userId OR game.winner = :userId',
            { userId },
        )
        .leftJoinAndSelect('game.player1', 'player1')
        .leftJoinAndSelect('game.player2', 'player2')
        .leftJoinAndSelect('game.winner', 'winner')
        .getMany();

    const playerStatistics: GetPlayerStatisticsDto[] = [];

    for (const game of playerGames) {
      const opponent = game.player1.user_id === userId ? game.player2 : game.player1;
      const isWinner = game.winner;
      const result = isWinner ? 1 : 0;

      playerStatistics.push(new GetPlayerStatisticsDto(
          opponent.user_id,
          opponent.username,
          result,
      ));
    }
    return playerStatistics;
  }



}
