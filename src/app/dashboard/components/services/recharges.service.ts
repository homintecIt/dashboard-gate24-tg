// src/app/dashboard/services/recharge.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {
  constructor(private http: HttpClient) {}

  getRechargeAbonnement(): Observable<any> {
    return this.http.post(apiEndpoints.rechargesUrl);
  }
}
