import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Transaction, TransactionResponse, VTransaction } from '../../interfaces/transaction';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = environment.apiTestUrl;

  // Gestion de l'état
  private transactionSubject = new BehaviorSubject<VTransaction[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  transaction$ = this.transactionSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chargement des données avec pagination, recherche et filtres
  loadTransactions(
    page: number = 1,
    limit: number = 10,
    accountNumber: string = '',
    type: string = '',
     dateStart?: string,
    dateEnd?: string,
    siteTransaction?: string
  ): Observable<TransactionResponse> {
    this.loadingSubject.next(true);

    const payload: any = {
      page: page , // L'API attend une page 0-based
      limit: limit
    };

    // Ajout des filtres si présents
    if (accountNumber) {
      payload.filter = accountNumber;
    }

    if (type) {
      payload.type = type;
    }
     if (dateStart && dateEnd) {
      payload.dateStart = dateStart;
      payload.dateEnd = dateEnd;

    }

    if (siteTransaction) {

      payload.siteTransaction = siteTransaction
    }

    return this.http.post<TransactionResponse>(`${this.apiUrl}/transactions/get/paginate/view`, payload).pipe(
      tap(response => {
        this.transactionSubject.next(response.items);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Erreur lors du chargement des transactions:', error);
        return throwError(() => error);
      }),
      shareReplay(1)
    );
  }

  // Méthode pour récupérer les transactions avec les filtres actuels
  getTransactions(
    page: number = 1,
    limit: number = 10,
    accountNumber: string = '',
    type: string = '',
     dateStart?: string,
    dateEnd?: string,
    siteTransaction?:string,
  ): Observable<TransactionResponse> {
    return this.loadTransactions(page, limit, accountNumber, type,dateStart,dateEnd,siteTransaction);
  }

  // Méthode de rafraîchissement
  refreshTransaction(page: number = 1, limit: number = 10): Observable<TransactionResponse> {
    return this.loadTransactions(page, limit);
  }

  // Méthode pour obtenir les transactions par numéro de compte
  getTransactionsByAccount(accountNumber: string, page: number = 1, limit: number = 10): Observable<TransactionResponse> {
    return this.loadTransactions(page, limit, accountNumber);
  }



 transactionByTag(body: any): Observable<TransactionResponse> {
  let params = new HttpParams()
    .set('page', body.page)
    .set('limit', body.limit);
  return this.http.get<TransactionResponse>(`${apiEndpoints.transactionUrl}/tag/${body.tagId}`, { params });
}

}



