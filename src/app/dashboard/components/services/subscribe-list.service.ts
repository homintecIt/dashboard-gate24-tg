
// @Injectable({
//   providedIn: 'root'
// })
// export class SubscribeListService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


export interface Subscription {
  id: number;
  targId: string;
  targCode: string;
  typeTarg: string;
  statutTarg: string;
  plaque: string | null;
  created_at: string;
  updated_at: string;
  compte: {
    uuid: string;
    accountNumber: string;
    solde: number;
  };
}
export interface SubscriptionResponse {
  items: Subscription[];
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
export class SubscriptionService {
  private apiUrl = environment.apiTestUrl;

  private subscriptionSubject = new BehaviorSubject<Subscription[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private lastLoadTime: number = 0;
  private cacheTimeout = 5 * 60 * 1000;

  subscription$ = this.subscriptionSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadSubscriptions(forceRefresh: boolean = false): Observable<SubscriptionResponse> {
    const currentTime = Date.now();
    const shouldRefresh = forceRefresh ||
                         this.subscriptionSubject.value.length === 0 ||
                         (currentTime - this.lastLoadTime) > this.cacheTimeout;

    if (shouldRefresh) {
      this.loadingSubject.next(true);

      return this.http.post<SubscriptionResponse>(`${this.apiUrl}/subscription/all`, {}).pipe(
        tap(response => {
          this.subscriptionSubject.next(response.items);
          this.lastLoadTime = currentTime;
          this.loadingSubject.next(false);
        }),
        shareReplay(1)
      );
    }

    return new Observable(subscriber => {
      subscriber.next({ items: this.subscriptionSubject.value } as SubscriptionResponse);
      subscriber.complete();
    });
  }

  refreshSubscriptions(): Observable<SubscriptionResponse> {
    return this.loadSubscriptions(true);
  }

  clearCache(): void {
    this.subscriptionSubject.next([]);
    this.lastLoadTime = 0;
  }
}
