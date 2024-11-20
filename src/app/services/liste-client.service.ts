import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import apiEndpoints from '../misc/api-endpoints.misc';
import { Observable } from 'rxjs';
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

  constructor(private httpClient: HttpClient) {}

  // recuperer les clients
  getAllClients(): Observable<ApiResponse<ListeClientService>> {
    return this.httpClient
      .post<ApiResponse<ListeClientService>>(`${apiEndpoints.listesClientsUrl}`, {})
      .pipe(
        tap((response) => {
          this.allClients = response.items;
          console.log('Données reçues:', response);
        })
      );
  }

  getPaginatedClients(page: number, limit: number): Observable<ApiResponse<ListeClientService>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.httpClient.post<ApiResponse<ListeClientService>>(`${apiEndpoints.listesClientsUrl}`, {}, { params });
  }


  // Obtenir les données en mémoire
  getLocalClients(): ListeClientService[] {
    return this.allClients;
  }

  // Récupérer les comptes 
  getAccounts(params: { page?: number; limit?: number; search?: string }): Observable<ApiResponse<AccountList>> {
    const httpParams = new HttpParams({ fromObject: params as any });

    return this.httpClient.post<ApiResponse<AccountList>>(`${apiEndpoints.listesComptesUrl}`, {}, { params: httpParams });
  }
}
