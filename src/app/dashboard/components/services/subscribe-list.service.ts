
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

  // Gestion de l'état
  private subscriptionSubject = new BehaviorSubject<Subscription[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  subscription$ = this.subscriptionSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chargement des données avec pagination
  loadSubscriptions(page: number = 1, limit: number = 10): Observable<SubscriptionResponse> {
    this.loadingSubject.next(true);

    return this.http.post<SubscriptionResponse>(`${this.apiUrl}/subscription/all`, {
      page,
      limit
    }).pipe(
      tap(response => {
        this.subscriptionSubject.next(response.items);
        this.loadingSubject.next(false);
      }),
      shareReplay(1)
    );
  }

  // Méthode de rafraîchissement
  refreshSubscriptions(page: number = 1, limit: number = 10): Observable<SubscriptionResponse> {
    return this.loadSubscriptions(page, limit);
  }
}
