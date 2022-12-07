import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  careerToggle: boolean = false;
  subscription!: Subscription;
  @Output() clearPlayerArray = new EventEmitter();

  constructor(private utilityService: UtilityService) {
    this.subscription = this.utilityService
      .onToggle()
      .subscribe((value) => (this.careerToggle = value));
  }

  toggleCareerStats() {
    this.clearPlayerArray.emit();
    this.utilityService.toggleCareerStats();
  }

  ngOnInit(): void {}
}
