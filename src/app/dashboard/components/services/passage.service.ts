import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PassageService {
  private apiUrl = environment.apiTestUrl;

  constructor(private http: HttpClient) {}

  getSites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/passage/get/sites/peages`);
  }

  getPassagesDaily(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/passage/get-passages-day`, payload);
  }
}
