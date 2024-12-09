import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Transaction, TransactionResponse } from '../../interfaces/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = environment.apiTestUrl;

  // Gestion de l'état
  private transactionSubject = new BehaviorSubject<Transaction[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  transaction$ = this.transactionSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chargement des données avec pagination
  loadTransaction(page: number = 1, limit: number = 0): Observable<TransactionResponse> {
    this.loadingSubject.next(true);

    return this.http.post<TransactionResponse>(`${this.apiUrl}/transactions/get/all`, {
      page,
      limit
    }).pipe(
      tap(response => {
        this.transactionSubject.next(response.items);
        this.loadingSubject.next(false);
      }),
      shareReplay(1)
    );
  }

  // Méthode de rafraîchissement
  refreshTransaction(page: number = 1, limit: number = 10): Observable<TransactionResponse> {
    return this.loadTransaction(page, limit);
  }
}



