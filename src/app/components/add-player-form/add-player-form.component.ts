import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Player } from 'src/app/Player';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-add-player-form',
  templateUrl: './add-player-form.component.html',
  styleUrls: ['./add-player-form.component.css'],
})
export class AddPlayerFormComponent implements OnInit {
  playerName!: string;
  playerID!: any;
  @Output() onBtnClick = new EventEmitter();
  @Output() onAddPlayer = new EventEmitter();
  showAddTask!: boolean;
  subscription: Subscription;

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) {
    this.subscription = this.utilityService
      .onToggle()
      .subscribe((value) => (this.showAddTask = value));
  }

  private playersUrl = 'https://www.balldontlie.io/api/v1/players';

  clickButton() {
    console.log('Button clicked');
    // this.utilityService.getPlayerStats();
  }

  async onSubmit() {
    if (!this.playerName) {
      alert('Please add a player');
      return;
    }

    const specificUrl = `${this.playersUrl}?search=${this.playerName}`;
    const player$ = await this.http.get<any>(specificUrl);
    let playerArray = await lastValueFrom(player$);
    playerArray = playerArray.data;
    // console.log(`Player array`, playerArray);
    this.playerID = playerArray[0].id;
    const first_name = playerArray[0].first_name;
    const last_name = playerArray[0].last_name;
    // console.log(
    //   'No issues, I will wait until promise is resolved..',
    //   this.playerID
    // );

    const playerGameStatisticsUrl = `https://www.balldontlie.io/api/v1/stats?seasons[]=2022&player_ids[]=${this.playerID}`;
    const playerGameStatistics$ = await this.http.get<any>(
      playerGameStatisticsUrl
    );
    let playerGameStatistics = await lastValueFrom(playerGameStatistics$);

    playerGameStatistics = deleteEmptyGames(playerGameStatistics.data);

    if (playerGameStatistics.length === 0) {
      alert('This player has never played a minute this season');
    } else {
      const newPlayer = createPlayerObject(
        first_name,
        last_name,
        playerGameStatistics
      );

      console.log(newPlayer);
      this.onAddPlayer.emit(newPlayer);
    }

    this.playerName = '';
  }
  ngOnInit(): void {}
}

function deleteEmptyGames(gameArray: []) {
  return gameArray.filter((game) => {
    return game['min'] !== '00';
  });
}

function createPlayerObject(first: string, last: string, gameArray: []) {
  // mins
  const avgMins =
    gameArray.reduce(
      (total: number, next) => total + parseInt(next['min']),
      0
    ) / gameArray.length;

  // points
  const avgPoints =
    gameArray.reduce((total: number, next) => total + next['pts'], 0) /
    gameArray.length;

  // rebounds
  const avgRebounds =
    gameArray.reduce((total: number, next) => total + next['reb'], 0) /
    gameArray.length;

  // assists
  const avgAssists =
    gameArray.reduce((total: number, next) => total + next['ast'], 0) /
    gameArray.length;

  // blocks
  const avgBlocks =
    gameArray.reduce((total: number, next) => total + next['blk'], 0) /
    gameArray.length;

  // steals
  const avgSteals =
    gameArray.reduce((total: number, next) => total + next['stl'], 0) /
    gameArray.length;

  // fg percentage
  const fgAttemps = gameArray.reduce(
    (total: number, next) => total + next['fga'],
    0
  );
  const fgMade = gameArray.reduce(
    (total: number, next) => total + next['fgm'],
    0
  );
  const avgFGPercent = fgMade / fgAttemps;
  console.log(avgFGPercent);

  // 3pt percentage
  const fg3Attemps = gameArray.reduce(
    (total: number, next) => total + next['fg3a'],
    0
  );
  const fg3Made = gameArray.reduce(
    (total: number, next) => total + next['fg3m'],
    0
  );
  const avg3FGPercent = fg3Made / fg3Attemps;

  const newPlayer = {
    first_name: first,
    last_name: last,
    mins: parseFloat(avgMins.toFixed(1)),
    points: parseFloat(avgPoints.toFixed(1)),
    rebounds: parseFloat(avgRebounds.toFixed(1)),
    assists: parseFloat(avgAssists.toFixed(1)),
    blocks: parseFloat(avgBlocks.toFixed(1)),
    steals: parseFloat(avgSteals.toFixed(1)),
    fieldGoalPercentage: parseFloat((avgFGPercent * 100).toFixed(2)),
    fieldGoal3Percentage: parseFloat((avg3FGPercent * 100).toFixed(2)),
  };

  return newPlayer;
}
