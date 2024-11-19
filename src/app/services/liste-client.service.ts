import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import apiEndpoints from '../misc/api-endpoints.misc';
import { Observable } from 'rxjs';
import { ListeClientService,AccountList } from '../models/listeClient.model';

@Injectable({
  providedIn: 'root'
})
export class ListesClientService {

  constructor(private httpClient: HttpClient) {}

  getAllClients(params: { page?: number; limit?: number; search?: string }): Observable<{items: ListeClientService[], meta: { totalItems: number }}> {

    const httpParams = new HttpParams({ fromObject: params as any });

    return this.httpClient.post<{items: ListeClientService[], meta: { totalItems: number }}>(`${apiEndpoints.listesClientsUrl}`, {}, { params: httpParams });
  }



  getAccounts(params: { page?: number; limit?: number; search?: string }): Observable<{items: AccountList[],meta: { totalItems: number }}> {
    const httpParams = new HttpParams({ fromObject: params as any });

    return this.httpClient.post<{items: AccountList[],meta: { totalItems: number }}>(`${apiEndpoints.listesComptesUrl}`,{}, { params: httpParams });
  }


}
