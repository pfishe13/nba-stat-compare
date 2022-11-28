import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { Player } from '../../Player';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  players: Player[] = [
    {
      first_name: 'Zion',
      last_name: 'Williamson',
      mins: 22,
      points: 23,
      rebounds: 3.4,
      assists: 2.1,
      blocks: 5.6,
      steals: 0.8,
      fieldGoalPercentage: 56.2,
      fieldGoal3Percentage: 80.2,
    },
  ];

  constructor(private utilityService: UtilityService) {}

  addPlayer(player: Player) {
    console.log(`Adding player to the players array`);
    this.players.push(player);
    console.log(this.players);
  }

  deletePlayer(player: Player) {
    console.log(`Deleting ${player}`);
  }

  ngOnInit(): void {}
}
