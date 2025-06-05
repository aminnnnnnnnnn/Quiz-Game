import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GetPlayerStatisticsDto } from '../../dto/GetPlayerStatisticsDto';
import { StatisticService } from './statistic.service';
import { UserIdGuard } from '../../user-id/user-id.guard';

@Controller('player')
export class StatisticsController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get(':userId/statistics')
  async getPlayerStatistics(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GetPlayerStatisticsDto[]> {
    return this.statisticService.getPlayerStatistics(userId);
  }
}
