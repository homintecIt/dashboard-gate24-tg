import { Component, OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { AccountList } from 'src/app/models/listeClient.model';

@Component({
  selector: 'app-liste-des-comptes-clients',
  templateUrl: './liste-des-comptes-clients.component.html',
  styleUrls: ['./liste-des-comptes-clients.component.css'],
})
export class ListeDesComptesClientsComponent implements OnInit {
  allAccounts: AccountList[] = [];
  filteredAccounts: AccountList[] = [];
  paginatedAccount:AccountList[] = [];
  totalPages: number = 0;
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  isSearchActive: boolean = false;

  constructor(private accountsService: ListesClientService) {}

  ngOnInit(): void {
    this.accountsService.getAccounts().subscribe({
      next: (response) => {
        this.allAccounts = response.items;
        this.filteredAccounts = [...this.allAccounts];
        this.totalItems = this.filteredAccounts.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.loadPage(this.currentPage); // Charger la première page
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients:', err);
      },
    });
  }

    // Gestion des pages
  loadPage(page: number): void {
    if (this.isSearchActive) {
      this.paginateAccounts(page);
    } else {
      this.paginateAccounts(page); // Données déjà en mémoire
    }
  }

  // Pagination côté client
  paginateAccounts(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAccount = this.filteredAccounts.slice(startIndex, endIndex);
  }

  onSearchChange(event: any): void {
    this.searchQuery = event.target.value.toLowerCase().trim();
    this.isSearchActive = this.searchQuery.length > 0;

    this.filteredAccounts = this.allAccounts.filter((client) =>
      Object.values(client).some((value) =>
        String(value).toLowerCase().includes(this.searchQuery)
      )
    );

    this.totalItems = this.filteredAccounts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.loadPage(1); // Revenir à la première page des résultats
  }


 // Changement de page
 onPageChange(newPage: number): void {
  if (newPage > 0 && newPage <= this.totalPages) {
    this.loadPage(newPage);
  }
}

  // Numéros des pages à afficher
  getPageNumbers(): number[] {
    const maxPagesToShow = 3;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}
