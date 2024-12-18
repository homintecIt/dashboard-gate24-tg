import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeSynchroServiceService {
  private apiUrl = environment.apiTestUrl;
  constructor(private http: HttpClient) {}

  getSynchroTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/type/synchro`);
  }

  updateSynchroStatus(type: string, status: boolean,id?:number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/status/synchro`, { type, status,id });
  }
  refreshSynchro(

  ): Observable<any> {
    return this.getSynchroTypes();
  }
}
