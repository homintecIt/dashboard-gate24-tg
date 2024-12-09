import { Component, OnDestroy, OnInit } from '@angular/core';
import { Transaction } from '../../interfaces/transaction';
import { Subject, takeUntil } from 'rxjs';
import { TransactionService } from '../services/transaction.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();

  selectedTransaction?: Transaction;
  isEditModalOpen = false;
  isDetailsModalOpen = false;
  isStatusChanging = false;

  // Données
  transaction: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

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
    private transactionservice: TransactionService,
    private modalService: BootstrapModalService
  ) {}

  ngOnInit(): void {
    // Écoute des transaction
    this.transactionservice.transaction$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transaction) => {
        this.transaction = transaction;
        this.filterTransactions();
      });

    // Écoute du chargement
    this.transactionservice.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    // Chargement initial
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des transaction
  loadTransactions(page: number = 1): void {
    this.transactionservice
      .loadTransaction(page, this.itemsPerPage)
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
          this.error = 'Impossible de charger les transaction';
        },
      });
  }

  // Filtrage des transaction
  filterTransactions(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTransactions = this.transaction.filter(
      (transactions) =>

      transactions.compte?.accountNumber.toLowerCase().includes(term) ||

      transactions.montant.toLowerCase().includes(term)
    );
  }

  // Recherche
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.filterTransactions();
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
      this.loadTransactions(page);
    }
  }

  // Navigation entre pages
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.transactionservice
      .loadTransaction(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les transaction';
        },
      });
    this.filterTransactions();
  }

  // Rafraîchissement
  refreshData(): void {
    this.loadTransactions(this.currentPage);
  }
}
