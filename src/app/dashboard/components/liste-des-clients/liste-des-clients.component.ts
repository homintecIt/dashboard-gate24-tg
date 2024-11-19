import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { ListeClientService } from 'src/app/models/listeClient.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-liste-des-clients',
  templateUrl: './liste-des-clients.component.html',
  styleUrls: ['./liste-des-clients.component.css']
})


export class ListeDesClientsComponent implements OnInit {
  data: ListeClientService[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  isLoading: boolean = false;
  Math = Math;

  constructor(private ListeClientService: ListesClientService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchQuery.trim() || undefined    };

    this.ListeClientService.getAllClients(params).subscribe({
      next: (response:any) => {
        this.data = response.items;
        this.totalItems = response.meta.totalItems;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err:any) => {
        console.error('Erreur lors du chargement des données:', err);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(event: any): void {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
    this.fetchClients();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.fetchClients();
  }

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
