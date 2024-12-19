import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';

export interface MonthlyReport {
  id: number;
  created_at: string;
  site: string;
  voie: string;
  montant: number;
  montant_restant: number;
  passage_verified_at: string;
  type_passage: string;
  refer: string;
  traiter: boolean;
  traiterTransaction: boolean;
  abonnement: {
    id: number;
    targCode: string;
    plaque: string;
    statutTarg: string;
  };
}

export interface MonthlyReportResponse {
  items: MonthlyReport[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MonthlyReportService {
  private apiUrl = environment.apiTestUrl;

  // État des rapports mensuels
  private monthlyReportsSubject = new BehaviorSubject<MonthlyReport[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  monthlyReports$ = this.monthlyReportsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chargement des données avec pagination et filtres
  loadReports(
    page: number = 1,
    limit: number = 10,
    dateStart?: string,
    dateEnd?: string,
    site?: string,
    targCode?: string
  ): Observable<MonthlyReportResponse> {
    this.loadingSubject.next(true);

    const payload = {
      page,
      limit,
      order: ["created_at"],
      search: {},
      dateStart,
      dateEnd,
      site: site || '',
      targCode: targCode || ''
    };

    return this.http.post<MonthlyReportResponse>(`${apiEndpoints.periodReportUrl}`, payload).pipe(
      tap(response => {
        this.monthlyReportsSubject.next(response.items);
        this.loadingSubject.next(false);
      }),
      shareReplay(1)
    );
  }

  // Options pour la liste déroulante des sites
  getDropdownOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${apiEndpoints.sitePassageUrl}`);
  }
}
