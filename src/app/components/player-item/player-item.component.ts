import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../Player';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrls: ['./player-item.component.css'],
})
export class PlayerItemComponent implements OnInit {
  @Input() player!: Player;

  constructor() {}

  deletePlayer() {
    console.log('Delete player');
  }

  ngOnInit(): void {}
}
