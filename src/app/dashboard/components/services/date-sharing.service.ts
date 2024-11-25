import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateSharingService {
  private dateSource = new BehaviorSubject<string | null>(null);
  currentDate = this.dateSource.asObservable();

  setDate(date: string): void {
    this.dateSource.next(date);
  }
}
