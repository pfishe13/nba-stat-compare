import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { Player } from '../../Player';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  showAddTask: boolean = true;
  subscription!: Subscription;

  constructor(private utilityService: UtilityService) {
    this.subscription = this.utilityService
      .onToggle()
      .subscribe((value) => (this.showAddTask = value));
  }

  toggleAddTask() {
    this.utilityService.toggleAddTask();
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  deletePlayer(player: Player) {
    console.log(`Deleting ${player}`);
  }

  ngOnInit(): void {}
}
