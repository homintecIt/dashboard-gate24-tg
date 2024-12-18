import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Recharge, RechargeResponse } from '../../interfaces/recharges';

@Injectable({
  providedIn: 'root'
})
export class RechargesService {
  private apiUrl = environment.apiTestUrl;

  // Gestion de l'état
  private rechargesSubject = new BehaviorSubject<Recharge[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  recharges$ = this.rechargesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chargement des données avec pagination
  loadRecharges(page: number = 1, limit: number = 0,filter?: string): Observable<RechargeResponse> {
    this.loadingSubject.next(true);

    return this.http.post<RechargeResponse>(`${this.apiUrl}/recharges/all`, {
      page,
      limit,
      filter
    }).pipe(
      tap(response => {
        this.rechargesSubject.next(response.items);
        this.loadingSubject.next(false);
      }),
      shareReplay(1)
    );
  }

  // Méthode de rafraîchissement
  refreshRecharges(page: number = 1, limit: number = 10): Observable<RechargeResponse> {
    return this.loadRecharges(page, limit);
  }
}
