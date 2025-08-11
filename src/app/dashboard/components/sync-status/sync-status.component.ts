import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { SyncStatus, SyncStatusService, SyncStatusResponse } from '../services/sync-status.service';
import { swalAnimation } from 'src/app/misc/utilities.misc';
import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
  ...swalAnimation
});

@Component({
  selector: 'app-sync-status',
  templateUrl: './sync-status.component.html',
  styleUrls: ['./sync-status.component.css']
})
export class SyncStatusComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Données
  syncStatusList: SyncStatus[] = [];
  filteredStatuses: SyncStatus[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Filtres
  selectedEntity: string = '';
  selectedStatus: string = '';
  selectedServer: string = '';
  searchTerm = '';

  // États
  loading = false;
  isSyncing = false;
  error: string | null = null;

  // Options de filtre (peuvent être chargées dynamiquement si nécessaire)
  entityOptions = [
    { value: 'transfertCompte', label: 'Transfert de compte' },
    { value: 'updateCompte', label: 'Mise à jour compte' },
    { value: 'recharge', label: 'Recharge' },
    { value: 'updateAbonnement', label: 'Mise à jour abonnement' },
    { value: 'transfertAbonnement', label: 'Transfert abonnement' }
  ];

  statusOptions = [
    { value: 'success', label: 'Succès' },
    { value: 'failed', label: 'Erreur' },
    { value: 'pending', label: 'En attente' }
  ];

  serverOptions = [
    { value: 'AKEPE', label: 'AKEPE' },
    { value: 'AUTRE_SERVEUR', label: 'Autre serveur' }
  ];

  constructor(private syncStatusService: SyncStatusService) {}

  ngOnInit(): void {
    // Écoute des mises à jour de statuts
    this.syncStatusService.syncStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(statuses => {
        this.syncStatusList = statuses;
        this.filterStatuses();
      });

    // Écoute du chargement
    this.syncStatusService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    // Configuration pour la recherche avec debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.currentPage = 1;
      this.loadSyncStatus();
    });

    // Chargement initial
    this.loadSyncStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  // Chargement des statuts avec les filtres actuels
  loadSyncStatus(): void {
    this.syncStatusService
      .loadSyncStatus(
        this.currentPage,
        this.itemsPerPage,
        this.selectedEntity || undefined,
        this.selectedStatus || undefined,
        this.selectedServer || undefined,
        this.searchTerm || undefined
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: SyncStatusResponse) => {
          this.syncStatusList = response.data;
          this.filteredStatuses = [...this.syncStatusList];
          this.totalItems = response.total;
          this.totalPages = response.totalPages;
          this.currentPage = parseInt(response.page, 10);
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les statuts de synchronisation';
        },
      });
  }

  // Filtrage local pour les cas où on a déjà les données
  filterStatuses(): void {
    this.filteredStatuses = [...this.syncStatusList];
  }

  // Gestion de la recherche
  onSearchInput(event: any): void {
    // Mise à jour du terme de recherche sans déclencher de requête
    this.searchTerm = event.target.value;
  }

  // Déclenche la recherche
  onSearch(event: any): void {
    this.currentPage = 1; // Réinitialiser à la première page lors d'une nouvelle recherche
    this.loadSyncStatus();
  }

  // Réinitialise la recherche
  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadSyncStatus();
  }

  // Gestion des changements de filtre
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadSyncStatus();
  }

  // Réinitialisation des filtres
  resetFilters(): void {
    this.selectedEntity = '';
    this.selectedStatus = '';
    this.selectedServer = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadSyncStatus();
  }

  // Pagination
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadSyncStatus();
  }

  // Rafraîchissement des données
  refreshData(): void {
    this.loadSyncStatus();
  }

  // Génération des pages pour la pagination
  getPagesArray(): number[] {
    const delta = 1;
    const left = this.currentPage - delta;
    const right = this.currentPage + delta;
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    for (let i = 0; i < range.length; i++) {
      if (i > 0) {
        if (range[i] - range[i - 1] > 1) {
          rangeWithDots.push(-1); // Points de suspension
        }
      }
      rangeWithDots.push(range[i]);
    }

    return rangeWithDots;
  }

  // Récupère le libellé d'une entité
  getEntityLabel(entity: string): string {
    const entityOption = this.entityOptions.find(opt => opt.value === entity);
    return entityOption ? entityOption.label : entity;
  }

  // Déclenche la synchronisation des échecs
  retryFailedSync(): void {
    this.isSyncing = true;
    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Confirmer la synchronisation',
      text: 'Voulez-vous relancer la synchronisation des échecs ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, synchroniser',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.syncStatusService.retryFailedSync().subscribe({
          next: (response) => {
            this.isSyncing = false;
            Swal.fire({
              icon: 'success',
              title: 'Synchronisation réussie',
              text: response.message || 'La synchronisation a été relancée avec succès',
              confirmButtonColor: '#3b5de7'
            });
            // Recharger les données
            this.loadSyncStatus();
          },
          error: (error) => {
            this.isSyncing = false;
            console.error('Erreur lors de la synchronisation:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la synchronisation',
              confirmButtonColor: '#3b5de7'
            });
          }
        });
      } else {
        this.isSyncing = false;
      }
    });
  }

  // Récupère le libellé d'un statut
  getStatusLabel(status: string): string {
    const statusOption = this.statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  }
}
