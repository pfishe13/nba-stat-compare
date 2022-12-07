import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private http: HttpClient) {}
  private showAddTask: boolean = true;
  private careerStats: boolean = false;
  private subject1 = new Subject<any>();
  private subject2 = new Subject<any>();

  toggleAddTask(): void {
    this.showAddTask = !this.showAddTask;
    this.subject1.next(this.showAddTask);
  }

  toggleCareerStats(): void {
    this.careerStats = !this.careerStats;
    this.subject2.next(this.careerStats);
  }

  onToggle(): Observable<any> {
    return this.subject1.asObservable();
  }

  onToggleCareerStats(): Observable<any> {
    return this.subject2.asObservable();
  }
}
