import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';
import { Observable } from 'rxjs';

interface SiteOption {
  passages_site: string;
}

@Injectable({
  providedIn: 'root'
})

export class MonthlyReportService {

  constructor(private http: HttpClient) {}

  // Récupérer les options pour la liste déroulante
  getDropdownOptions(): Observable<SiteOption[]> {
    return this.http.get<SiteOption[]>(`${apiEndpoints.sitePassageUrl}`);
  }

  getReports(payload: any): Observable<any> {
    return this.http.post<any>(`${apiEndpoints.monthlyReportUrl}`,payload);
  }

}
