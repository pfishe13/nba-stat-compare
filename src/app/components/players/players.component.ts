import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { Player } from '../../Player';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];

  constructor(private utilityService: UtilityService) {}

  addPlayer(player: Player) {
    this.players.push(player);
  }

  deletePlayer(player: Player) {
    console.log(`Deleting ${player}`);
  }

  ngOnInit(): void {}
}
