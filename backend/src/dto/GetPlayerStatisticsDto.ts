export class GetPlayerStatisticsDto {
  opponent_id: number;
  opponent_username: string;
  winner_id: number;
  constructor(
    opponent_id: number,
    opponent_username: string,
    winner_id: number,
  ) {
    this.opponent_id = opponent_id;
    this.opponent_username = opponent_username;
    this.winner_id = winner_id;
  }
}
