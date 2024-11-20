// src/app/dashboard/components/subscribe-list/subscribe-list.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Subscription, SubscriptionService } from '../services/subscribe-list.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { SubscriptionEditModalComponent } from './subscription-edit-modal/subscription-edit-modal.component';

@Component({
  selector: 'app-subscribe-list',
  templateUrl: './subscribe-list.component.html',
  styleUrls: ['./subscribe-list.component.css']
})

export class SubscribeListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Données
  subscrption: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Recherche
  searchTerm = '';

  // États
  loading = false;
  error: string | null = null;

  constructor(
    private subscrptionService: SubscriptionService,
    private modalService: BootstrapModalService,  ) {}


    addTag(compteId: number) {
      this.modalService.openModal(SubscriptionEditModalComponent, compteId, 'modal-lg',);

      // Souscrire aux événements du modal si nécessaire
      this.modalService.modalRef.onHidden?.subscribe(() => {
        this.refreshData(); // Rafraîchir la liste après fermeture du modal
      });
    }

  ngOnInit(): void {
    // Écoute des subscrption
    this.subscrptionService.subscription$
      .pipe(takeUntil(this.destroy$))
      .subscribe(subscrption => {
        this.subscrption = subscrption;
        this.filterSubscriptions();
      });

    // Écoute du chargement
    this.subscrptionService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    // Chargement initial
    this.loadSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des subscrption
  loadSubscriptions(page: number = 1): void {
    this.subscrptionService.loadSubscriptions(page, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les subscrption';
        }
      });
  }

  // Filtrage des subscrption
  filterSubscriptions(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredSubscriptions = this.subscrption.filter(subscription =>
      subscription.compte.accountNumber.toLowerCase().includes(term) ||
      subscription.targId.toLowerCase().includes(term) ||
      subscription.targCode.toLowerCase().includes(term) ||
      subscription.plaque?.toLowerCase().includes(term)
    );
  }

  // Recherche
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.filterSubscriptions();
  }

  // Génération des pages
  getPagesArray(): number[] {
    const delta = 1;
    const left = this.currentPage - delta;
    const right = this.currentPage + delta;
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    // Générer la plage complète
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    // Ajouter des points si nécessaire
    for (let i = 0; i < range.length; i++) {
      if (i > 0) {
        if (range[i] - range[i - 1] > 1) {
          rangeWithDots.push(-1); // Représente les points de suspension
        }
      }
      rangeWithDots.push(range[i]);
    }

    return rangeWithDots;
  }

  // Changement de page
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSubscriptions(page);
    }
  }

    // Navigation entre pages
    goToPage(page: number): void {
      if (page < 1 || page > this.totalPages) return;

      this.currentPage = page;
      this.filterSubscriptions();
    }

  // Rafraîchissement
  refreshData(): void {
    this.loadSubscriptions(this.currentPage);
  }
}
