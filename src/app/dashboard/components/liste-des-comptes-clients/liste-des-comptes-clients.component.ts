import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { Account } from 'src/app/models/listeClient.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';

@Component({
  selector: 'app-liste-des-comptes-clients',
  templateUrl: './liste-des-comptes-clients.component.html',
  styleUrls: ['./liste-des-comptes-clients.component.css'],
})
export class ListeDesComptesClientsComponent implements OnInit , OnDestroy{
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  selectedAccount?: Account;
  isEditModalOpen = false;
  isDetailsModalOpen = false;
  isStatusChanging = false;

  // Données
  account: Account[] = [];
  filteredAccounts: Account[] = [];

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
    private accountService: ListesClientService,
    private modalService: BootstrapModalService
  ) {}


  ngOnInit(): void {
    // Écoute des account
    this.accountService.account$
      .pipe(takeUntil(this.destroy$))
      .subscribe((account) => {
        console.log("account", account);

        this.account = account;
        this.filterAccounts();
      });

    // Écoute du chargement
    this.accountService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    // Chargement initial
    this.loadAccounts();

    // Nouvelle configuration pour la recherche dynamique
    this.searchSubject.pipe(
      debounceTime(300), // Attendre 300ms après la dernière frappe
      distinctUntilChanged(), // Ignorer si la valeur est identique à la précédente
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      // Réinitialiser à la page 1 lors d'une nouvelle recherche
      this.currentPage = 1;

      // Charger les abonnements avec le terme de recherche
      this.loadAccounts(this.currentPage, searchTerm);
    });
    console.log(this.account);

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  // Chargement desloadAccounts pour accepter un terme de recherche
  loadAccounts(page: number = 1, searchTerm?: string): void {
    this.accountService
      .loadAccounts(page, this.itemsPerPage, searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;

          // Supprimer le filtrage local
          // this.filteredAccounts = response.items;
        },
        error: (err) => {
          this.loading = !this.loading;
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les abonnements';
        },
      });
  }
  // Filtrage des account
  filterAccounts(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredAccounts = this.account.filter(
      (account) =>
        account.accountNumber?.toLowerCase().includes(term)
    );
  }

  //  la méthode onSearch
  onSearch(event: any): void {
    const searchTerm = event.target.value;
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
      this.loadAccounts(page);
    }
  }

  // Navigation entre pages
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.accountService
      .loadAccounts(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les account';
        },
      });
    this.filterAccounts();
  }

  // Rafraîchissement
  refreshData(): void {
    this.loadAccounts(this.currentPage);
  }
}
// private destroy$ = new Subject<void>();

// allAccounts: Account[] = [];
// filteredAccounts: Account[] = [];
// paginatedAccount:Account[] = [];
// totalPages: number = 0;
// totalItems: number = 0;
// currentPage: number = 1;
// itemsPerPage: number = 10;
// searchQuery: string = '';
// isSearchActive: boolean = false;
// error: string | null = null;

// constructor(private accountsService: ListesClientService) {}

// ngOnInit(): void {
//   this.accountsService.getAccounts(this.currentPage, this.itemsPerPage).subscribe({
//     next: (response) => {
//       this.allAccounts = response.items;
//       this.filteredAccounts = [...this.allAccounts];
//       this.totalItems = this.filteredAccounts.length;
//       this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
//       this.loadPage(this.currentPage); // Charger la première page
//     },
//     error: (err) => {
//       console.error('Erreur lors du chargement des clients:', err);
//     },
//   });
// }

//   // Gestion des pages
// loadPage(page: number): void {
//   if (this.isSearchActive) {
//     this.paginateAccounts(page);
//   } else {
//     this.paginateAccounts(page); // Données déjà en mémoire
//   }
// }

// // Pagination côté client
// paginateAccounts(page: number): void {
//   this.currentPage = page;
//   const startIndex = (page - 1) * this.itemsPerPage;
//   const endIndex = startIndex + this.itemsPerPage;
//   this.paginatedAccount = this.filteredAccounts.slice(startIndex, endIndex);
// }

// onSearchChange(event: any): void {
//   this.searchQuery = event.target.value.toLowerCase().trim();
//   this.isSearchActive = this.searchQuery.length > 0;

//   this.filteredAccounts = this.allAccounts.filter((client) =>
//     Object.values(client).some((value) =>
//       String(value).toLowerCase().includes(this.searchQuery)
//     )
//   );

//   this.totalItems = this.filteredAccounts.length;
//   this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
//   this.loadPage(1); // Revenir à la première page des résultats
// }


// // Génération des pages
// getPagesArray(): number[] {
// const delta = 1;
// const left = this.currentPage - delta;
// const right = this.currentPage + delta;
// const range: number[] = [];
// const rangeWithDots: number[] = [];

// // Générer la plage complète
// for (let i = 1; i <= this.totalPages; i++) {
//   if (i === 1 || i === this.totalPages || (i >= left && i <= right)) {
//     range.push(i);
//   }
// }

// // Ajouter des points si nécessaire
// for (let i = 0; i < range.length; i++) {
//   if (i > 0) {
//     if (range[i] - range[i - 1] > 1) {
//       rangeWithDots.push(-1); // Représente les points de suspension
//     }
//   }
//   rangeWithDots.push(range[i]);
// }

// return rangeWithDots;
// }

// // Changement de page
// onPageChange(page: number): void {
// if (page >= 1 && page <= this.totalPages) {
//   this.currentPage = page;
//   this.loadPage(page);
// }
// }

// // Navigation entre pages
// goToPage(page: number): void {
// if (page < 1 || page > this.totalPages) return;

// this.currentPage = page;
// this.accountsService
//   .getAccounts(this.currentPage, this.itemsPerPage)
//   .pipe(takeUntil(this.destroy$))
//   .subscribe({
//     next: (response) => {
//       this.totalItems = response.meta.totalItems;
//       this.totalPages = response.meta.totalPages;
//       this.currentPage = response.meta.currentPage;
//     },
//     error: (err) => {
//       console.error('Erreur de chargement', err);
//       this.error = 'Impossible de charger les account';
//     },
//   });
// this.filterAccounts();
// }

// // Filtrage des account
// filterAccounts(): void {
// const term = this.searchQuery.toLowerCase();

// this.filteredAccounts = this.allAccounts.filter(
//   (account) =>
//     account.accountNumber?.toLowerCase().includes(term)
// );
// }

