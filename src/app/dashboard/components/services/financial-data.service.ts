import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialDataService {

  constructor(private http: HttpClient) {}

  getFinancialData(requestBody: any): Observable<any> {
    return this.http.post<any>(`${apiEndpoints.getFinancialDataUrl}`, requestBody);
  }
}
