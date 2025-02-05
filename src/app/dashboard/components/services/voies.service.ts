// src/app/services/voies.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoiesService {
  private apiUrl = environment.apiTestUrl;

  private voiesSubject = new BehaviorSubject<any[]>([]);
  voies$ = this.voiesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadVoies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/voies`).pipe(
      tap(response => {
        this.voiesSubject.next(response as any[]);
      })
    );
  }

  createVoie(voie: { nom: string, ip: string, site_id: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/voies`, voie).pipe(
      tap(response => {
        const currentVoies = this.voiesSubject.value;
        const newVoie: any = response;

        this.voiesSubject.next([...currentVoies, newVoie]);
      })
    );
  }

  refreshVoies(): Observable<any> {
    return this.loadVoies();
  }

  updateVoieData(voie: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/voies/${voie.id}`, voie);
  }
}
