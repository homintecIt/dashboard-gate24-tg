import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';

export interface MonthlyReportResponse {
  items: any[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MonthlyReportService {
  private reportsSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  reports$ = this.reportsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getDropdownOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${apiEndpoints.sitePassageUrl}`);
  }

  getReports(payload: any): Observable<MonthlyReportResponse> {
    this.loadingSubject.next(true);
    return this.http.post<MonthlyReportResponse>(`${apiEndpoints.periodReportUrl}`, payload).pipe(
      tap(response => {
        this.reportsSubject.next(response.items);
        this.loadingSubject.next(false);
      }),
      shareReplay(1)
    );
  }
}
