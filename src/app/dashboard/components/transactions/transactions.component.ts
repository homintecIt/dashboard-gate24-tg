import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { Transaction, TransactionResponse } from '../../interfaces/transaction';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  selectedType = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;

  // Options pour le filtre de type
  typeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'credit', label: 'Crédit' },
    { value: 'debit', label: 'Débit' }
  ];

  private destroy$ = new Subject<void>();

  selectedTransaction?: Transaction;
  accountNumber?: string;
  isEditModalOpen = false;
  isDetailsModalOpen = false;
  isStatusChanging = false;

  constructor(
    @Inject(TransactionService) private transactionService: TransactionService,
    private modalService: BootstrapModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['accountNumber']) {
        this.searchTerm = params['accountNumber'];
        this.accountNumber = params['accountNumber'];
      }
      this.loadTransactions();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTransactions(): void {
    this.loading = true;
    this.error = null;

    // S'assurer que currentPage est valide (1-based dans le composant)
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    // Convertir la page en 0-based pour l'API
    const pageForApi = this.currentPage;

    this.transactionService
      .getTransactions(
        pageForApi,  // Envoyer la page 0-based à l'API
        this.itemsPerPage,
        this.searchTerm,
        this.selectedType
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: TransactionResponse) => {
          this.transactions = response.items || [];
          this.totalItems = response.meta?.totalItems || 0;
          this.totalPages = response.meta?.totalPages || 1;

          // Mettre à jour currentPage en fonction de la réponse du serveur (0-based)
          const serverPage = response.meta?.currentPage ?? 0;
          this.currentPage = serverPage; // Convertir en 1-based pour l'UI

          // Si la page demandée est invalide, revenir à la première page
          if (this.currentPage < 1 || this.currentPage > this.totalPages) {
            this.currentPage = 1;
            this.loadTransactions();
            return;
          }

          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des transactions';
          this.loading = false;
          console.error('Erreur:', err);

          // Afficher une alerte d'erreur
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors du chargement des transactions',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1; // Réinitialiser à la première page lors d'une nouvelle recherche
    this.loadTransactions();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.currentPage = 1;
    this.loadTransactions();
  }

  // Exposer l'objet Math pour le template
  Math = Math;

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }

  // Obtenir les pages autour de la page courante pour la pagination
  getPagesAroundCurrent(): number[] {
    if (this.totalPages <= 2) return [];

    const pages: number[] = [];
    const maxPagesToShow = 3; // Nombre de pages à montrer autour de la page courante

    let startPage = Math.max(2, this.currentPage - 1);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

    // Ajuster si on est près du début
    if (this.currentPage <= 3) {
      endPage = Math.min(4, this.totalPages - 1);
    }

    // Ajuster si on est près de la fin
    if (this.currentPage >= this.totalPages - 2) {
      startPage = Math.max(2, this.totalPages - 3);
    }

    // Ajouter les pages autour de la page courante
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < this.totalPages) {
        pages.push(i);
      }
    }

    return pages;
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Ajouter la première page si nécessaire
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push(-1); // -1 représente les points de suspension
      }
    }

    // Ajouter les pages visibles
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Ajouter la dernière page si nécessaire
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pages.push(-1); // -1 représente les points de suspension
      }
      pages.push(this.totalPages);
    }

    return pages;
  }

  getTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'credit': 'Crédit',
      'debit': 'Débit'
    };
    return typeMap[type] || type;
  }

  goBack(): void {
    window.history.back();
  }

  // Écoute des transaction
  // this.transactionservice.transaction$
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe((transaction) => {
  //     this.transaction = transaction;
  //     this.filterTransactions();
  //   });

  // Écoute du chargement
  // this.transactionservice.loading$
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe((loading) => {
  //     this.loading = loading;
  //   });

  // Chargement initial
  // this.loadTransactions();

  // Filtrage des transaction
  // filterTransactions(): void {
  //   const term = this.searchTerm.toLowerCase();
  //   this.filteredTransactions = this.transaction.filter(
  //     (transactions) =>
  //       transactions.compte?.accountNumber.toLowerCase().includes(term) ||
  //       transactions.montant.toLowerCase().includes(term)
  //   );
  // }

  // Recherche
  // onSearch(event: any): void {
  //   this.searchTerm = event.target.value;
  //   this.filterTransactions();
  // }

  // Génération des pages
  // getPagesArray(): number[] {
  //   const delta = 1;
  //   const left = this.currentPage - delta;
  //   const right = this.currentPage + delta;
  //   const range: number[] = [];
  //   const rangeWithDots: number[] = [];

  //   // Générer la plage complète
  //   for (let i = 1; i <= this.totalPages; i++) {
  //     if (i === 1 || i === this.totalPages || (i >= left && i <= right)) {
  //       range.push(i);
  //     }
  //   }

  //   // Ajouter des points si nécessaire
  //   for (let i = 0; i < range.length; i++) {
  //     if (i > 0) {
  //       if (range[i] - range[i - 1] > 1) {
  //         rangeWithDots.push(-1); // Représente les points de suspension
  //       }
  //     }
  //     rangeWithDots.push(range[i]);
  //   }

  //   return rangeWithDots;
  // }

  // Navigation entre pages
  // goToPage(page: number): void {
  //   if (page < 1 || page > this.totalPages) return;

  //   this.currentPage = page;
  //   this.transactionservice
  //     .loadTransaction(this.currentPage, this.itemsPerPage)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         this.totalItems = response.meta.totalItems;
  //         this.totalPages = response.meta.totalPages;
  //         this.currentPage = response.meta.currentPage;
  //       },
  //       error: (err) => {
  //         console.error('Erreur de chargement', err);
  //         this.error = 'Impossible de charger les transaction';
  //       },
  //     });
  //   this.filterTransactions();
  // }

  // Rafraîchissement
  // refreshData(): void {
  //   this.loadTransactions(this.currentPage);
  // }
}
