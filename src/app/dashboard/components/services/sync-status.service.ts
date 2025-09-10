import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface SyncStatus {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  entity: string;
  description: string;
  entityId: number;
  targetServer: string;
  status: string;
  syncedAt: string;
  lastError: string | null;
}

export interface SyncStatusResponse {
  data: SyncStatus[];
  total: number;
  page: string;
  limit: string;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class SyncStatusService {
  private apiUrl = environment.apiTestUrl;
  private syncStatusSubject = new BehaviorSubject<SyncStatus[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  // Exposer les observables
  syncStatus$ = this.syncStatusSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Charge les statuts de synchronisation avec pagination et filtrage optionnel
   * @param page Numéro de page
   * @param limit Nombre d'éléments par page
   * @param entity Filtre par entité (optionnel)
   * @param status Filtre par statut (optionnel)
   * @param targetServer Filtre par serveur cible (optionnel)
   */
  loadSyncStatus(
    page: number = 1,
    limit: number = 10,
    entity?: string,
    status?: string,
    targetServer?: string,
    searchTerm?: string
  ): Observable<SyncStatusResponse> {
    this.loadingSubject.next(true);
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (entity) params = params.set('entity', entity);
    if (status) params = params.set('status', status);
    if (targetServer) params = params.set('targetServer', targetServer);
    if (searchTerm) params = params.set('search', searchTerm);
    
    return this.http.get<SyncStatusResponse>(`${this.apiUrl}/sync`, { params }).pipe(
      tap(response => {
        this.syncStatusSubject.next(response.data);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Erreur lors du chargement des statuts de synchronisation:', error);
        return throwError(() => error);
      }),
      shareReplay(1)
    );
  }

  /**
   * Rafraîchit la liste des statuts de synchronisation
   * @param page Numéro de page
   * @param limit Nombre d'éléments par page
   */
  refreshSyncStatus(
    page: number = 1,
    limit: number = 10
  ): Observable<SyncStatusResponse> {
    return this.loadSyncStatus(page, limit);
  }

  /**
   * Récupère un statut de synchronisation par son ID
   * @param id ID du statut de synchronisation
   */
  getSyncStatusById(id: number): Observable<SyncStatus> {
    return this.http.get<SyncStatus>(`${this.apiUrl}/sync/${id}`).pipe(
      catchError(error => {
        console.error(`Erreur lors de la récupération du statut de synchronisation ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Filtre les statuts de synchronisation localement
   * @param status Statut à filtrer
   */
  filterByStatus(status: string): SyncStatus[] {
    return this.syncStatusSubject.value.filter(item => item.status === status);
  }

  /**
   * Filtre les statuts de synchronisation par entité
   * @param entity Nom de l'entité
   */
  filterByEntity(entity: string): SyncStatus[] {
    return this.syncStatusSubject.value.filter(item => item.entity === entity);
  }

  /**
   * Filtre les statuts de synchronisation par serveur cible
   * @param targetServer Nom du serveur cible
   */
  filterByTargetServer(targetServer: string): SyncStatus[] {
    return this.syncStatusSubject.value.filter(item => item.targetServer === targetServer);
  }

  /**
   * Relance la synchronisation des échecs
   */
  retryFailedSync(): Observable<{ message: string }> {
    this.loadingSubject.next(true);
    return this.http.post<{ message: string }>(`${this.apiUrl}/sync/retry-failed`, {}).pipe(
      tap(() => {
        // Recharger les données après la synchronisation
        this.loadSyncStatus(1, 10);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Erreur lors de la synchronisation:', error);
        return throwError(() => error);
      })
    );
  }
}
