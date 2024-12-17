import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, shareReplay, catchError, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface StatusUpdatePayload {
  targId: string;
  isActive: boolean;
}

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


// Mettez à jour l'interface Subscription dans votre service
export interface Subscription {
  id: number;
  targId: string;
  targCode: string;
  typeTarg: string;
  statutTarg: string;
  plaque: string | null;
  created_at: string;
  updated_at: string;

  // Nouveaux champs
  nom?: string;
  prenom?: string;
  tel?: number;
  idBadge?: string;
  codeClient?: string;
  solde?: string;
  iduhf?: string;
  codeUhf?: string;
  user_id?: number;
  isExo:boolean
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
  providedIn: 'root',
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
  loadSubscriptions(
    page: number = 1,
    limit: number = 0,
    filter?: string
  ): Observable<SubscriptionResponse> {
    this.loadingSubject.next(true);

    return this.http
      .post<SubscriptionResponse>(`${this.apiUrl}/subscription/all`, {
        page,
        limit,
        filter // Le terme de recherche sera passé ici
      })
      .pipe(
        tap((response) => {
          this.subscriptionSubject.next(response.items);
          this.loadingSubject.next(false);
        }),
        shareReplay(1)
      );
  }

  // Méthode pour récupérer un abonnement par son ID
  getSubscriptionById(id: number): Observable<Subscription> {
    return this.http
      .get<Subscription>(`${this.apiUrl}/subscription/${id}`)
      .pipe(
        catchError((error) => {
          console.error(
            "Erreur lors de la récupération de l'abonnement:",
            error
          );
          return throwError(() => error);
        })
      );
  }

  // Méthode de rafraîchissement
  refreshSubscriptions(
    page: number = 1,
    limit: number = 10
  ): Observable<SubscriptionResponse> {
    return this.loadSubscriptions(page, limit);
  }

  updateSubscription(
    id: number,
    updateDto: SubscriptionUpdateDto
  ): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/subscription/${id}`, updateDto)
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

  // Méthode pour mettre à jour le statut
  updateSubscriptionStatus(payload: StatusUpdatePayload): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/subscription/status`,
        payload
      )
      .pipe(
        tap(() => {
          // Optionnel : rafraîchir les données après la mise à jour
          this.loadSubscriptions(1, 10).subscribe();
        }),
        catchError((error) => {
          console.error('Erreur lors de la mise à jour du statut:', error);
          throw error;
        })
      );
  }
}
