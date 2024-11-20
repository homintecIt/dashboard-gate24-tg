import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import apiEndpoints from '../misc/api-endpoints.misc';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ListeClientService, AccountList } from '../models/listeClient.model';


export interface ApiResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ListesClientService {
  private allClients: ListeClientService[] = [];
  private allAccounts: AccountList[] = [];
  constructor(private httpClient: HttpClient) {}
  private dataLoaded: boolean = false;
  private dataAccountsLoaded: boolean = false;

  getAllClients(): Observable<ApiResponse<ListeClientService>> {
    if (this.dataLoaded) {
      return of({
        items: this.allClients,
        meta: {
          totalItems: this.allClients.length,
          totalPages: 1,
          currentPage: 1,
        },
      });
    }

    const body = { page: 0, limit: 0 };
    return this.httpClient
      .post<ApiResponse<ListeClientService>>(apiEndpoints.listesClientsUrl, body)
      .pipe(
        tap((response) => {
          this.allClients = response.items;
          this.dataLoaded = true;
        })
      );
  }


  getPaginatedClients(
    page: number,
    limit: number,
    search?: string
  ): Observable<ApiResponse<ListeClientService>> {
    const body = {
      page,
      limit,
      search: search || '',
    };

    return this.httpClient
      .post<ApiResponse<ListeClientService>>(
        `${apiEndpoints.listesClientsUrl}`,
        body
      )
      .pipe(
        tap((response) => {
          console.log(
            `Données paginées (Page ${page}, Limit ${limit}):`,
            response
          );
        })
      );
  }

  // Obtenir les données en mémoire
  getLocalClients(): ListeClientService[] {
    return this.allClients;
  }

  // Récupérer les comptes
  getAccounts(): Observable<ApiResponse<AccountList>> {
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

    const body = { page: 0, limit: 0 };

    return this.httpClient.post<ApiResponse<AccountList>>(
      apiEndpoints.listesComptesUrl,body).pipe(tap((response)=>{
        this.allAccounts=response.items;
        this.dataAccountsLoaded=true;
      }))
  }

  getPaginatedAccounts(
    page: number,
    limit: number,
    search?: string
  ): Observable<ApiResponse<AccountList>> {
    const body = {
      page,
      limit,
      search: search || '',
    };

    return this.httpClient
      .post<ApiResponse<AccountList>>(
        `${apiEndpoints.listesComptesUrl}`,
        body
      )
      .pipe(
        tap((response) => {
          console.log(
            `Données paginées (Page ${page}, Limit ${limit}):`,
            response
          );
        })
      );
  }

  getLocalAccount(): AccountList[] {
    return this.allAccounts;
  }

  getClient(uuid: string): Observable<ListeClientService> {
    const clientUrl = apiEndpoints.getClientUrl.replace(':uuid', uuid);
    console.log(clientUrl)
    return this.httpClient.get<ListeClientService>(clientUrl);
  }


  updateClient(uuid: string, client: Partial<ListeClientService>): Observable<ListeClientService> {
    const updateClientUrl = apiEndpoints.updateClientUrl.replace(':uuid', uuid);
    return this.httpClient.put<ListeClientService>(updateClientUrl, client);
  }


}
