import {Component, OnInit} from '@angular/core';
// @ts-ignore
import {Chart} from 'chart.js';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {GameService} from "../services/game/game.service";
import {AuthenticationComponent} from "../authentication/authentication.component";
import {StatisticsService} from "../services/statistics/statistics.service";
import {AuthenticationService} from "../services/authentication/authentication.service";

interface PlayerStatistics {
  wins: number;
  losses: number;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  playerStatistics: { [playerName: string]: PlayerStatistics } = {};
  chart: any;

  playerLanguage: string = "Player";
  winsLanguage: string = "Wins";
  lossesLanguage: string = "Losses";

  myUserId: number = 0;

  constructor(private router: Router,
              private translate: TranslateService,
              private gameService: GameService,
              private authentication: AuthenticationComponent,
              private statisticsService: StatisticsService,
              private authenticationService: AuthenticationService) {

  }


  toLogin() {
    this.router.navigate(['/']);
  }

  ngOnInit() {

    if (localStorage.getItem("userId") != null) {
      this.myUserId = parseInt(localStorage.getItem("userId")!);
    }

    this.getPlayerStatistics();

    this.translate.stream('player').subscribe((res: any) => {
      this.playerLanguage = res;
    });

    this.translate.stream('wins').subscribe((res: any) => {
      this.winsLanguage = res;
    });

    this.translate.stream('losses').subscribe((res: any) => {
      this.lossesLanguage = res;
    });
  }


  updatePlayerStatistics(playerName: string, hasWon: boolean) {
    if (!this.playerStatistics[playerName]) {
      this.playerStatistics[playerName] = {wins: 0, losses: 0};
    }

    if (hasWon) {
      this.playerStatistics[playerName].wins++;
    } else {
      this.playerStatistics[playerName].losses++;
    }
  }

  createChart() {

    const labels = Object.keys(this.playerStatistics);
    const wins = Object.values(this.playerStatistics).map(stats => stats.wins);
    const losses = Object.values(this.playerStatistics).map(stats => stats.losses);

    this.chart = new Chart('playerStatsChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {data: wins, label: this.winsLanguage, backgroundColor: 'rgba(75, 192, 75, 0.6)'},
          {data: losses, label: this.lossesLanguage, backgroundColor: 'rgba(192, 75, 75, 0.6)'}
        ]
      },
      options: {
        scales: {
          y: {beginAtZero: true},
          ticks: {
            stepSize: 1
          }
        },
      }
    });
  }

  getPlayerStatistics() {
    this.statisticsService.getPlayerStatistics(this.myUserId).subscribe((response: any) => {

      for (let i = 0; i < response.length; i++) {

        console.log("in for loop")

        if (response[i].winner_id == this.myUserId) {
          this.updatePlayerStatistics(response[i].opponent_username, true);
        } else {
          this.updatePlayerStatistics(response[i].opponent_username, false);
        }
      }

    }, (error) => {
      console.log(error);
    });

    setTimeout(() => {
      this.createChart();
    }, 500);
  }

}
