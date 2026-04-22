import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import apiEndpoints from '../misc/api-endpoints.misc';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { Client, Account } from '../models/listeClient.model';
import { environment } from 'src/environments/environment';


export interface ApiResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}
export interface SearchFilters {
  nom?: string;
  prenom?: string;
}
@Injectable({
  providedIn: 'root',
})
export class ListesClientService {
  private apiUrl = environment.apiTestUrl;
private allAccounts: Account[] = [];
private dataAccountsLoaded: boolean = false;

  // Gestion de l'état
  private clientSubject = new BehaviorSubject<Client[]>([]);
  private accountSubject = new BehaviorSubject<Account[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  client$ = this.clientSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  account$ = this.accountSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chargement des données avec pagination
  loadClients(
    page: number = 1,
    limit: number = 0,
    filters?: string
  ): Observable<ApiResponse<Client>> {
    this.loadingSubject.next(true);

    // Construire le payload avec le filtre directement dans le body
    const body: any = { page, limit };
    if (filters && filters.trim() !== '') {
      body.filters = filters.trim();
    }

    console.log('Payload sent to API:', body);

    return this.http
      .post<ApiResponse<Client>>(`${this.apiUrl}/clients/all`, body)
      .pipe(
        tap((response) => {
          console.log('API Response:', response);
          this.clientSubject.next(response.items);
          this.loadingSubject.next(false);
        }),
        shareReplay(1)
      );
  }

  // Méthode pour récupérer un abonnement par son ID
  getClientById(id: string): Observable<Client> {
    return this.http
      .get<Client>(`${this.apiUrl}/clients/${id}`)
      .pipe(
        catchError((error) => {
          console.error(
            "Erreur lors de la récupération de l'abonnement:",
            error
          );
          return throwError(() => error);
        })
      );
  }

  // Méthode de rafraîchissement
  refreshClients(
    page: number = 1,
    limit: number = 10
  ): Observable<ApiResponse<Client>> {
    return this.loadClients(page, limit);
  }

  updateClient(
    uuid: string,
    updateDto: Partial<Client>
  ): Observable<any> {
        const updateClientUrl = apiEndpoints.updateClientUrl.replace(':uuid', uuid);
       return this.http.put<Client>(updateClientUrl, updateDto);
  }

  // Méthode pour mettre à jour le statut
  updateClientStatus(payload: Partial<Client>): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/subscription/status`,
        payload
      )
      .pipe(
        tap(() => {
          // Optionnel : rafraîchir les données après la mise à jour
          this.loadClients(1, 10).subscribe();
        }),
        catchError((error) => {
          console.error('Erreur lors de la mise à jour du statut:', error);
          throw error;
        })
      );
  }

// Récupérer les comptes
getAccounts( page: number = 1,
  limit: number ): Observable<ApiResponse<Account>> {
  if (this.dataAccountsLoaded) {
    return of({
      items: this.allAccounts,
      meta: {
        totalItems: this.allAccounts.length,
        totalPages: 1,
        currentPage: 1,
      },
    });
  }

  const body = { page: 1, limit };

  return this.http.post<ApiResponse<Account>>(
    apiEndpoints.listesComptesUrl,body).pipe(tap((response)=>{
      this.allAccounts=response.items;
      this.dataAccountsLoaded=true;
    }))
}

loadAccounts(
  page: number = 1,
  limit: number = 0,
  filter?: string,
  solde?: number
): Observable<ApiResponse<Client>> {
  this.loadingSubject.next(true);

  // Build payload conditionally
  const body: any = { page, limit };
  if (typeof filter === 'string' && filter.trim() !== '') {
    body.accountNumber = filter.trim();
  }
  if (typeof solde === 'number' && !isNaN(solde)) {
    body.solde = solde;
  }

  return this.http
    .post<ApiResponse<Client>>(`${this.apiUrl}/comptes/all`, body)
    .pipe(
      tap((response) => {
        this.accountSubject.next(response.items);
        this.loadingSubject.next(false);
      }),
      shareReplay(1)
    );
}

getClientByTel(tel: string): Observable<Client> {
  return this.http.post<Client>(`${this.apiUrl}/clients/get/byTel`, { tel });
}

getAccountbyAccountNumber(accountNumber: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/comptes/get/accountNumber`, { accountNumber });
}



  getRechargesbyAccount(accountNumber: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/recharges/get/byAccountNumber/last`, { accountNumber });
}



deleteAccount(accountNumber: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/comptes/delete/local/${accountNumber}`);
}

restoreAccount(accountNumber: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/comptes/restore`, { accountNumber });
}

deleteClient(uuid: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/clients/${uuid}`);
}

  getDistinctClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients/distinct/client`);
  }

}


