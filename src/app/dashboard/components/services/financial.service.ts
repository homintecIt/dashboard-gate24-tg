import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private apiUrl = environment.apiTestUrl;

  constructor(private http: HttpClient) {}

  getFinancialData(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/financier/get-data-financier`, payload);
  }
}

