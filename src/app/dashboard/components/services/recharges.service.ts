import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Compte {
  id: number;
  uuid: string;
  accountNumber: string;
  solde: number;
}

export interface Recharge {
  id: number;
  created_at: string;
  montant: string;
  montant_avant_recharge: number;
  montant_apres_recharge: number;
  site: string;
  percepteur: string;
  refer: string | null;
  traiter: number;
  compte: Compte;
}

export interface RechargeResponse {
  items: Recharge[];
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
export class RechargeService {
  private apiUrl = environment.apiTestUrl;

  private rechargesSubject = new BehaviorSubject<Recharge[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private lastLoadTime: number = 0;
  private cacheTimeout = 5 * 60 * 1000;


  // Paramètres de pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

    // Paramètres de recherche
  searchTerm = '';

  recharges$ = this.rechargesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}


  loadRecharges(forceRefresh: boolean = false): Observable<RechargeResponse> {
    const currentTime = Date.now();
    const shouldRefresh = forceRefresh ||
                         this.rechargesSubject.value.length === 0 ||
                         (currentTime - this.lastLoadTime) > this.cacheTimeout;

    if (shouldRefresh) {
      this.loadingSubject.next(true);

      return this.http.post<RechargeResponse>(`${this.apiUrl}/recharges/all`, {
              draw: this.currentPage,
              start: (this.currentPage - 1) * this.itemsPerPage,
              length: this.itemsPerPage,
              search: {
                value: this.searchTerm,
                regex: false
              },
              order: [{ column: 0, dir: 'desc' }],
              columns: [
                { data: 'targCode', searchable: true, orderable: true },
                { data: 'typeTarg', searchable: true, orderable: true },
                { data: 'statutTarg', searchable: true, orderable: true }
              ]
            }).pipe(
        tap(response => {
          this.rechargesSubject.next(response.items);
          this.lastLoadTime = currentTime;
          this.loadingSubject.next(false);
        }),
        shareReplay(1)
      );
    }

    return new Observable(subscriber => {
      subscriber.next({ items: this.rechargesSubject.value } as RechargeResponse);
      subscriber.complete();
    });
  }

  refreshRecharges(): Observable<RechargeResponse> {
    return this.loadRecharges(true);
  }

  clearCache(): void {
    this.rechargesSubject.next([]);
    this.lastLoadTime = 0;
  }
}
