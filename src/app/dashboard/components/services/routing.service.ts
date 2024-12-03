import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, shareReplay, tap, throwError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RoutingInterface {
  id: number;
  created_at: string;
  updated_at: string;
  titre: string;
  icon: string;
  link: string;
  frontend_icon?: string;
  frontend_route?: string;
}

export interface AffectRouteInterface {
  id: string
  menuId:number[]
}
@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private apiUrl = environment.apiTestUrl;

  // Gestion de l'état
  private routingSubject = new BehaviorSubject<RoutingInterface[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  routing$ = this.routingSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

    // Chargement des routes
    loadRoutes(): Observable<RoutingInterface[]> {
      this.loadingSubject.next(true);

      return this.http.get<RoutingInterface[]>(`${this.apiUrl}/users/get-menus`).pipe(
        tap(routes => {
          this.routingSubject.next(routes);
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          console.error('Erreur de chargement des routes', error);
          return throwError(() => error);
        }),
        shareReplay(1)
      );
    }

    affectRoutes(prePayload: AffectRouteInterface)/* : Observable<AffectRouteInterface> */ {
      this.loadingSubject.next(true);
      const menu :any[]=[]
      prePayload.menuId.map((i: any)=>{
        menu.push(i.id)
      })
      const payload= {
        id: prePayload.id,
        manuId: menu
      }
      console.log(menu);

      return this.http.post<AffectRouteInterface>(`${this.apiUrl}/users/add-menus`, payload).pipe(
        tap(response => {
          console.log(response);

          this.loadingSubject.next(false);
        }),
        shareReplay(1)
      );
    }
}
