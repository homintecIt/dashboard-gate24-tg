import { Transaction } from './../dashboard/interfaces/transaction';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import apiEndpoints from '../misc/api-endpoints.misc';
import { Observable } from 'rxjs';
import { Statistic } from '../models/statistic.model';

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


    saveTargwithoutAmount(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/save/targ-without-amount`, data);
  }


  rechargeAccount(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.rechargesUrl}/recharge/byAccountNumber`, data);
  }



  passages(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.passageUrl}/save/litige`, data);
  }

  rechargeTag(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.rechargesUrl}/recharge/byTargCode`, data);
  }

  saveClient(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.clientsUrl}`, data);
  }

  saveClientOther(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.clientsUrl}/other`, data);
  }

  deleteTag(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${apiEndpoints.subscriptionUrl}/${id}`);
  }

  onSuccess(data: any) {
    this.successEvent.emit(data);
  }

  onFailure(data: any) {
    this.failureEvent.emit(data);
  }


  getStatistics(): Observable<Statistic[]> {
      return this.httpClient.get<Statistic[]>(`${apiEndpoints.statisticsUrl}/get/2024`);
  }

  getTargNotUse(data: any): Observable<any> {
      return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/abonnement/not/use`,data);
  }



  addTagCompteClient(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/add/targ/compte`, data);
  }

  addNewTagCompteClient(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/add/targ/compte/without/solde`, data);
  }

  searchWithName(query: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.clientsUrl}/get/nom/prenom`, query);
  }

  searchWithPhoneNumber(phoneNumber: any): Observable<any> {
    const playload = {
      tel: phoneNumber
  }
    return this.httpClient.post<any>(`${apiEndpoints.clientsUrl}/get/byTel`, playload);
  }

  toggleExoStatus(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/update/exo/byTargcode`, data);
  }

  toggleStatus(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/status`, data);
  }

    toggleStatusActivatedCompte(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.comptesUrl}/activate`, data);
  }

   toggleStatusDesactivatedCompte(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.comptesUrl}/disabled`, data);
  }

  searchWithTagCode(query: any): Observable<any> {
    return this.httpClient.get<any>(`${apiEndpoints.subscriptionUrl}/tagCode/${query}`);
  }

  searchWithTagID(query: any): Observable<any> {
    return this.httpClient.get<any>(`${apiEndpoints.subscriptionUrl}/tagId/${query}`);
  }



    transferTagToCompte(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/transfer/abonnement/home`, data);
  }


   transferSoldeCompte(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.comptesUrl}/transfer/solde`, data);
  }

    transferCompteClient(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.comptesUrl}/transfer/compte/client`, data);
  }



  saveCompte(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/save/targ/with/saveCompte`, data);
  }


  enregTag(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/save/targ/without/solde`, data);
  }

  getTransfersPaginated(params: { page?: number; limit?: number; type?: string; sourceAccountId?: string; targetAccountId?: string }): Observable<any> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.type) httpParams = httpParams.set('type', params.type);
    if (params.sourceAccountId) httpParams = httpParams.set('sourceAccountId', params.sourceAccountId);
    if (params.targetAccountId) httpParams = httpParams.set('targetAccountId', params.targetAccountId);
    return this.httpClient.get<any>(`${apiEndpoints.apiUrlBase}/transfers/paginated`, { params: httpParams });
  }


  createClientCompte(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.comptesUrl}/save`, data);
  }

  updateClient(data: any, uuid: any): Observable<any> {
    return this.httpClient.put<any>(`${apiEndpoints.clientsUrl}/update/${uuid}`, data);
  }

    updateTag(data: any,): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.subscriptionUrl}/update/info/`, data);
  }



  listClient(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.clientsUrl}/all`, data);
  }

  listClientCompte(data: any): Observable<any> {
    return this.httpClient.post<any>(`${apiEndpoints.comptesUrl}/all`, data);
  }


   transformerRfidcode(chaine: string): string {
    let resultat = "";

    // Iterate through each character in the string
    for (let i = 0; i < chaine.length; i++) {
      switch (chaine[i]) {
        case "à":
        case "À":
          resultat += "0";
          break;
        case "&":
          resultat += "1";
          break;
        case "é":
        case "É":
          resultat += "2";
          break;
        case "\"":
          resultat += "3";
          break;
        case "'":
          resultat += "4";
          break;
        case "(":
          resultat += "5";
          break;
        case "-":
          resultat += "6";
          break;
        case "è":
        case "È":
          resultat += "7";
          break;
        case "_":
          resultat += "8";
          break;
        case "ç":
          resultat += "9";
          break;
        // Add any other characters you'd like to handle here
        default:
          // If the character is not in the mapping, append it unchanged
          resultat += chaine[i];
      }
    }

    // If no transformation was made, return the original string
    return resultat || chaine;
  }





}
