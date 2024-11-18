import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import apiEndpoints from '../misc/api-endpoints.misc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  @Output() successEvent = new EventEmitter<any>();
  @Output() failureEvent = new EventEmitter<any>();

  constructor(private httpClient: HttpClient) {}

  getCompteClient(id: any): Observable<any> {
    const playload = {
        accountNumber: id
    }
    return this.httpClient.post<any>(`${apiEndpoints.comptesUrl}/get/accountNumber`, playload);
  }

  search(query: any): Observable<any> {
    return this.httpClient.get<any>(`${apiEndpoints.searchUrl}?q=${query}`);
  }

  saveTag(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/save/targ`, data);
  }

  rechargeAccount(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.rechargesUrl}/recharge/byAccountNumber`, data);
  }

  rechargeTag(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.rechargesUrl}/recharge/byTargCode`, data);
  }

  saveClient(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.clientsUrl}`, data);
  }

  deleteTag(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${apiEndpoints.clientsUrl}/${id}`);
  }

  onSuccess(data: any) {
    this.successEvent.emit(data);
  }

  onFailure(data: any) {
    this.failureEvent.emit(data);
  }

}
