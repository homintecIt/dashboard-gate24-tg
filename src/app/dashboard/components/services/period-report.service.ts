import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodReportService {


  constructor(private http: HttpClient) {}

  // Récupérer les options pour la liste déroulante
  getDropdownOptions(): Observable<[]> {
    const rep=this.http.get<[]>(`${apiEndpoints.sitePassageUrl}`,{});
    console.log(rep)
    return rep
  }

  getReports(option: any): Observable<any> {
    return this.http.post<any>(`${apiEndpoints.sitePassageUrl}`,option);
  }
}
