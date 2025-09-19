import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeSynchroServiceService {

  @Output() succesEvent = new EventEmitter<any>()
  @Output() failedEvent = new EventEmitter<any>()
  private apiUrl = environment.apiTestUrl;
  constructor(private http: HttpClient) {}

  getSynchroTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/type/synchro`);
  }

  updateSynchroStatus(type: string, status: boolean,id?:number,time?:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/status/synchro`, { type, status,id,time });
  }
  refreshSynchro(

  ): Observable<any> {
    return this.getSynchroTypes();
  }

  onSuccess(data:any){
    this.succesEvent.emit(data)
  }

  onFailure(data:any){
    this.failedEvent.emit(data)
  }
}
