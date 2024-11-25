import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialDataService {
  private baseUrl = '/financier/get-data-financier'; // Endpoint POST

  constructor(private http: HttpClient) { }

  getFinancialData(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }
}
