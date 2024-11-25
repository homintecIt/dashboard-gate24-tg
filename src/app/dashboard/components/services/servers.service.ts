import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';

@Injectable({
  providedIn: 'root'
})
export class ServersService {

  constructor(private http: HttpClient) { }

  getServer(): Observable<any[]> {
    return this.http.get<any[]>(`${apiEndpoints.getServerUrl}`);
  }

  updateServer(url:string , etat: string): Observable<any> {
    return this.http.post(`${apiEndpoints.UpdateServerUrl}`, {url,etat});
  }
}
