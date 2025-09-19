import { Injectable } from '@angular/core';
import { interval, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  currentDate$: Observable<Date>;

  constructor() {
    this.currentDate$ = interval(1000).pipe(map(() => new Date()));
  }
}
