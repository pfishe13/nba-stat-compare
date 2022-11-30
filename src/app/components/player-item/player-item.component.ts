import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player } from '../../Player';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrls: ['./player-item.component.css'],
})
export class PlayerItemComponent implements OnInit {
  @Input() player!: Player;
  @Output() onDeletePlayer: EventEmitter<Player> = new EventEmitter();

  constructor() {}

  deletePlayer(player: Player) {
    this.onDeletePlayer.emit(player);
  }

  ngOnInit(): void {}
}
