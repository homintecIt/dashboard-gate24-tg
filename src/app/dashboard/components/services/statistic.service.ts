import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';
import { Statistic } from 'src/app/models/statistic.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  @Output() successEvent = new EventEmitter<any>();
  @Output() failureEvent = new EventEmitter<any>();

  private statisticsSubject: BehaviorSubject<Statistic[]> = new BehaviorSubject<Statistic[]>([]);
  public statistics$: Observable<Statistic[]> = this.statisticsSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getStatistics(): Observable<Statistic[]> {
    if (this.statisticsSubject.getValue().length === 0) {
      return this.httpClient.get<Statistic[]>(`${apiEndpoints.statisticsUrl}/get`).pipe(
        tap(statistics => this.statisticsSubject.next(statistics))
      );
    } else {
      return this.statistics$;
    }
  }

  getStatistic(id: any): Observable<Statistic> {
    return this.httpClient.get<Statistic>(`${apiEndpoints.statisticsUrl}/${id}`);
  }

  saveStatistic(data: any): Observable<Statistic> {
    return this.httpClient.post<Statistic>(`${apiEndpoints.statisticsUrl}`, data).pipe(
      tap(() => this.clearStatisticsCache())
    );
  }

  updateStatistic(id: any, data: any): Observable<Statistic> {
    return this.httpClient.patch<Statistic>(`${apiEndpoints.statisticsUrl}/${id}`, data).pipe(
      tap(() => this.clearStatisticsCache())
    );
  }

  deleteStatistic(id: string): Observable<Statistic> {
    return this.httpClient.delete<Statistic>(`${apiEndpoints.statisticsUrl}/${id}`).pipe(
      tap(() => this.clearStatisticsCache())
    );
  }

  onSuccess(data: any) {
    this.successEvent.emit(data);
  }

  onFailure(data: any) {
    this.failureEvent.emit(data);
  }

  private clearStatisticsCache() {
    this.statisticsSubject.next([]);
  }
}
