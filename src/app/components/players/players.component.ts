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
    this.players = this.players.filter(
      (item) => item.first_name !== player.first_name
    );
  }

  ngOnInit(): void {}
}
