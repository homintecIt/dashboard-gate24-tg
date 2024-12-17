// src/app/services/server.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private apiUrl = environment.apiTestUrl;

  // BehaviorSubject pour stocker les serveurs
  private serveursSubject = new BehaviorSubject<any>([]);
  serveurs$ = this.serveursSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Charger les serveurs
  loadServeurs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/servers`).pipe(
      tap(response => {
        const data =  response;
        this.serveursSubject.next(data);
      })
    );
  }

  // Ajouter un nouveau serveur
  createServeur(serveur: { site: string, url: string, etat: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/save/serve/synchro`, serveur).pipe(
      tap(response => {
        const currentServeurs = this.serveursSubject.value;
        const newServeur: {
          [key: string]: any
      } =  response;
        console.log(currentServeurs);
        newServeur['id'] =currentServeurs.length +1

        this.serveursSubject.next([...currentServeurs, newServeur]);
      })
    );
  }

  refreshServeurs(

  ): Observable<any> {
    return this.loadServeurs();
  }

  updateServer(server: object): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/status/server/synchro`, server);
  }

  updateServerData(server:object): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/status/server/synchro`, server);
  }
}



