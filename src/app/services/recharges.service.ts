import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RechargesService {
  private apiUrl = environment.apiTestUrl;

  constructor(private http: HttpClient) {}

  getRechargesAbonnement(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/v2/homintec/recharges/get-recharge-abonnment`);
  }
}
 