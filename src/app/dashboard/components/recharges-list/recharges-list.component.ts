// recharges-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Recharge } from '../../interfaces/recharges';
import { RechargesService } from '../services/recharges.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';

@Component({
  selector: 'app-recharges-list',
  templateUrl: './recharges-list.component.html',
  styleUrls: ['./recharges-list.component.css']
})
export class RechargesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  selectedRecharge?: Recharge;
  isEditModalOpen = false;
  isDetailsModalOpen = false;
  isStatusChanging = false;

  // Données
  recharge: Recharge[] = [];
  filteredRecharges: Recharge[] = [];

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
    private rechargeService: RechargesService,
    private modalService: BootstrapModalService
  ) {}

  ngOnInit(): void {


    // Écoute des recharge
    this.rechargeService.recharges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((recharge) => {
        this.recharge = recharge;
        this.filterRecharges();
      });

    // Écoute du chargement
    this.rechargeService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    // Chargement initial
    this.loadRecharges();

      // Nouvelle configuration pour la recherche dynamique
      this.searchSubject.pipe(
        debounceTime(300), // Attendre 300ms après la dernière frappe
        distinctUntilChanged(), // Ignorer si la valeur est identique à la précédente
        takeUntil(this.destroy$)
      ).subscribe(searchTerm => {
        // Réinitialiser à la page 1 lors d'une nouvelle recherche
        this.currentPage = 1;

        // Charger les abonnements avec le terme de recherche
        this.loadRecharges(this.currentPage, searchTerm);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des recharge
  loadRecharges(page: number = 1,filter?: string | undefined): void {
    this.rechargeService
      .loadRecharges(page, this.itemsPerPage,filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;
        },
        error: (err) => {
          this.loading = !this.loading;
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les recharge';
        },
      });
  }

  // Filtrage des recharge
  filterRecharges(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRecharges = this.recharge.filter(
      (recharges) =>

      recharges.compte?.accountNumber.toLowerCase().includes(term) ||
      recharges.site.toLowerCase().includes(term) ||
      recharges.percepteur.toLowerCase().includes(term) ||
      recharges.montant.toLowerCase().includes(term)
    );
  }

  // Recherche
  onSearch(event: any): void {
    const searchTerm = event.target.value;
    this.searchTerm= searchTerm;
    this.searchSubject.next(searchTerm);
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
      this.loadRecharges(page);
    }
  }

  // Navigation entre pages
  goToPage(page: number): void {
    console.log("la recherche",this.searchTerm);

    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.rechargeService
      .loadRecharges(this.currentPage, this.itemsPerPage, this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les recharge';
        },
      });
    this.filterRecharges();
  }

  // Rafraîchissement
  refreshData(): void {
    this.loadRecharges(this.currentPage);
  }
}
