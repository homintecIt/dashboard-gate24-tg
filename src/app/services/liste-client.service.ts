import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import apiEndpoints from '../misc/api-endpoints.misc';
import { Observable } from 'rxjs';
import { ListeClientService } from '../models/listeClient.model';

@Injectable({
  providedIn: 'root'
})
export class ListesClientService {

  constructor(private httpClient: HttpClient) {}

  getAllClients(): Observable<{items: ListeClientService[]}> {
    return this.httpClient.post<{items: ListeClientService[]}>(`${apiEndpoints.listesClientsUrl}`,{});
  }
}
