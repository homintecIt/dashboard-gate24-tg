import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SitesService {
  private apiUrl = environment.apiTestUrl;

  // BehaviorSubject to store sites
  private sitesSubject = new BehaviorSubject<any[]>([]);
  sites$ = this.sitesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Load sites
  loadSites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sites`).pipe(
      tap(response => {
        this.sitesSubject.next(response as any[]);
      })
    );
  }

  // Create a new site
  createSite(site: { nom: string, tarif: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/sites`, site).pipe(
      tap(response => {
        const currentSites = this.sitesSubject.value;
        const newSite: any = response;

        this.sitesSubject.next([...currentSites, newSite]);
      })
    );
  }

  // Refresh sites list
  refreshSites(): Observable<any> {
    return this.loadSites();
  }

  // Update site data
  updateSiteData(site: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/sites/${site.id}`, site);
  }
}
