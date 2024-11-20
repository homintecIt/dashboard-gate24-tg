import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


export interface SubscriptionUpdateDto {
  nom?: string;
  prenom?: string;
  tel?: number;
  idBadge?: string;
  codeClient?: string;
  solde?: string;
  iduhf?: string;
  codeUhf?: string;
  plaque?: string;
  user_id?: number;
}


export interface Subscription {
  user_id: null;
  codeUhf: string;
  iduhf: string;
  solde: string;
  codeClient: string;
  idBadge: string;
  tel: null;
  prenom: string;
  nom: string;
  id: number;
  targId: string;
  targCode: string;
  typeTarg: string;
  statutTarg: string;
  plaque: string | null;
  created_at: string;
  updated_at: string;
  compte: {
    uuid: string;
    accountNumber: string;
    solde: number;
  };
}
export interface SubscriptionResponse {
  items: Subscription[];
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

export class SubscriptionService {
  private apiUrl = environment.apiTestUrl;

  // Gestion de l'état
  private subscriptionSubject = new BehaviorSubject<Subscription[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  subscription$ = this.subscriptionSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chargement des données avec pagination
  loadSubscriptions(page: number = 1, limit: number = 10): Observable<SubscriptionResponse> {
    this.loadingSubject.next(true);

    return this.http.post<SubscriptionResponse>(`${this.apiUrl}/subscription/all`, {
      page,
      limit
    }).pipe(
      tap(response => {
        this.subscriptionSubject.next(response.items);
        this.loadingSubject.next(false);
      }),
      shareReplay(1)
    );
  }


    // Méthode pour récupérer un abonnement par son ID
    getSubscriptionById(id: number): Observable<Subscription> {
      return this.http.get<Subscription>(`${this.apiUrl}/subscription/${id}`).pipe(
        catchError((error) => {
          console.error('Erreur lors de la récupération de l\'abonnement:', error);
          return throwError(() => error);
        })
      );
    }


  // Méthode de rafraîchissement
  refreshSubscriptions(page: number = 1, limit: number = 10): Observable<SubscriptionResponse> {
    return this.loadSubscriptions(page, limit);
  }


  updateSubscription(id: number, updateDto: SubscriptionUpdateDto): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/subscription/${id}`, updateDto)
      .pipe(
        tap(() => {
          // Rafraîchir les données après la mise à jour
          this.loadSubscriptions(1, 10).subscribe();
        }),
        catchError((error) => {
          console.error('Erreur lors de la mise à jour:', error);
          return throwError(() => error);
        })
      );
  }
}
