import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  showAddTask: boolean = false;
  subscription!: Subscription;

  constructor(private utilityService: UtilityService) {
    this.subscription = this.utilityService
      .onToggle()
      .subscribe((value) => (this.showAddTask = value));
  }

  toggleAddTask() {
    this.utilityService.toggleAddTask();
  }

  ngOnInit(): void {}
}
