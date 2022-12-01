import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-add-player-form',
  templateUrl: './add-player-form.component.html',
  styleUrls: ['./add-player-form.component.css'],
})
export class AddPlayerFormComponent implements OnInit {
  playerName!: string;
  playerID!: any;
  errorMessage!: string;
  @Output() onBtnClick = new EventEmitter();
  @Output() onAddPlayer = new EventEmitter();
  showAddTask: boolean = true;
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

  async onSubmit() {
    if (!this.playerName) {
      this.errorMessage = 'Please add a player';
      return;
    }

    let names = await parseName(this.playerName);
    let playerObject: any = await this.findPlayer(names);
    if (playerObject === undefined) return;

    this.playerID = playerObject.id;
    const first_name = playerObject.first_name;
    const last_name = playerObject.last_name;

    let playerGameStatistics: any = await this.getPlayerStats(this.playerID);
    playerGameStatistics = deleteEmptyGames(playerGameStatistics.data);

    if (playerGameStatistics.length === 0) {
      this.errorMessage = 'This player has not played this season';
      this.playerName = '';
      return;
    } else {
      const newPlayer = createPlayerObject(
        first_name,
        last_name,
        playerGameStatistics
      );

      this.onAddPlayer.emit(newPlayer);
    }

    this.errorMessage = '';
    this.playerName = '';
  }

  clickButton() {
    console.log('Button clicked');
  }

  async findPlayer(names: string[]) {
    let playerArray;
    let playerObject;

    try {
      const specificUrl = `${this.playersUrl}?search=${names[2]}&per_page=100`;
      const player$ = await this.http.get<any>(specificUrl);
      playerArray = await lastValueFrom(player$);
    } catch {
      this.errorMessage = 'Error finding player. Refine your search.';
      return;
    }

    playerArray = playerArray.data;

    if (playerArray.length > 1) {
      let filteredArray = playerArray.find(
        (item: any) => item.first_name.toLowerCase() === names[0].toLowerCase()
      );
      playerObject = filteredArray;

      if (filteredArray === undefined) {
        filteredArray = playerArray.find(
          (item: any) =>
            item.first_name.toLowerCase().charAt(0) ===
              names[0].toLowerCase().charAt(0) &&
            item.first_name.toLowerCase().charAt(1) ===
              names[0].toLowerCase().charAt(1)
        );
        playerObject = filteredArray;
      }
      if (filteredArray === undefined) {
        this.errorMessage =
          'Too many or no results found. Please make your search more specific';
        return;
      }
    } else if (playerArray.length === 1) {
      if (
        playerArray[0].first_name.toLowerCase().charAt(0) !==
          names[0].toLowerCase().charAt(0) ||
        playerArray[0].first_name.toLowerCase().charAt(1) !==
          names[0].toLowerCase().charAt(1)
      ) {
        this.errorMessage = 'No results found. Try again';
        return;
      }
      playerObject = playerArray[0];
    }
    return playerObject;
  }

  async getPlayerStats(id: number) {
    const playerGameStatisticsUrl = `https://www.balldontlie.io/api/v1/stats?seasons[]=2022&player_ids[]=${this.playerID}`;
    const playerGameStatistics$ = await this.http.get<any>(
      playerGameStatisticsUrl
    );

    let playerGameStatistics = await lastValueFrom(playerGameStatistics$);
    return playerGameStatistics;
  }

  ngOnInit(): void {}
}

function parseName(name: string) {
  let nameArray = name.split(' ');
  let searchName;

  if (nameArray[1] === undefined) {
    searchName = nameArray[0];
  } else {
    searchName = nameArray[1];
  }

  return [nameArray[0], nameArray[1], searchName];
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
