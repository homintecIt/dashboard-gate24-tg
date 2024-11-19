// src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiTestUrl; // Assurez-vous de définir cette URL dans environment.ts

  constructor(private http: HttpClient) {}

  /**
   * Méthode générique pour les requêtes POST
   * @param endpoint - Le point de terminaison de l'API
   * @param params - Les paramètres de la requête
   * @returns Observable de la réponse
   */
  post<T>(endpoint: string, params: any = {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, params);
  }

  /**
   * Méthode générique pour les requêtes GET
   * @param endpoint - Le point de terminaison de l'API
   * @param params - Les paramètres de la requête
   * @returns Observable de la réponse
   */
  get<T>(endpoint: string, params: any = {}): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params: httpParams });
  }
}
