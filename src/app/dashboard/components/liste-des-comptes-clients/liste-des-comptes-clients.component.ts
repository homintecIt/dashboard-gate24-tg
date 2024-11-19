import { Component, OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { AccountList } from 'src/app/models/listeClient.model';

@Component({
  selector: 'app-liste-des-comptes-clients',
  templateUrl: './liste-des-comptes-clients.component.html',
  styleUrls: ['./liste-des-comptes-clients.component.css'],
})
export class ListeDesComptesClientsComponent implements OnInit {
  data: AccountList[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  isLoading: boolean = false;
  Math=Math;

  constructor(private accountsService: ListesClientService) {}

  ngOnInit(): void {
    this.fetchAccount();
  }

  // recuperation des donness
  fetchAccount(): void {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchQuery.trim() || undefined,
    };

    this.accountsService.getAccounts(params).subscribe({
      next: (response) => {
        console.log('Données reçues :', response);
        this.data = response.items;
        this.totalItems = response.meta.totalItems;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes clients :', err);
        this.isLoading = false;
      },
    });
  }

// recherche input
  onSearchChange(event: any): void {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
    this.fetchAccount();
  }

  /**
   * Handle pagination page change.
   */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.fetchAccount();
  }

  /**
   * pagination.
   */
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const maxPagesToShow = 2;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    const pageNumbers: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }
}
