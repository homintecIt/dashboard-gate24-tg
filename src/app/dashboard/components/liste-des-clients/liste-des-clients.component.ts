import { Component, OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { Client } from 'src/app/models/listeClient.model';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { EditClientModalComponent } from './edit-client-modal/edit-client-modal.component';
@Component({
  selector: 'app-liste-des-clients',
  templateUrl: './liste-des-clients.component.html',
  styleUrls: ['./liste-des-clients.component.css'],
})

export class ListeDesClientsComponent implements OnInit {

  allClients: Client[] = [];
  filteredClients: Client[] = [];
  paginatedClients: Client[] = [];
  totalPages: number = 0;
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  isSearchActive: boolean = false;

  constructor(private listesClientService: ListesClientService,
    private modalService: BootstrapModalService

  ) {}

  openEditModal(client: Client) {
    console.log('VerifieClient', client)
    this.modalService.openModal(EditClientModalComponent, client,'modal-lg');
  }

  refreshClients(): void {
    this.listesClientService.getAllClients().subscribe({
      next: (response) => {
        this.allClients = response.items; // Mets à jour la liste affichée
        console.log('Liste des clients actualisée', this.allClients);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des clients', error);
      }
    });
  }

  handleClientUpdate(updatedClient: any): void {
    const index = this.allClients.findIndex(client => client.uuid === updatedClient.uuid);
    if (index !== -1) {
      this.allClients[index] = updatedClient;
      this.filteredClients = [...this.allClients];
    this.loadPage(this.currentPage);
    } else {
      this.refreshClients();
    }
  }


  ngOnInit(): void {
    // Charger tous les clients une seule fois
    this.listesClientService.getAllClients().subscribe({
      next: (response) => {
        this.allClients = response.items;
        this.filteredClients = [...this.allClients];
        this.totalItems = this.filteredClients.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.loadPage(this.currentPage);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients:', err);
      },
    });
    this.refreshClients();
  }

  // Gestion des pages
  loadPage(page: number): void {
    if (this.isSearchActive) {
      this.paginateClients(page);
    } else {
      this.paginateClients(page);
    }
  }

  // Pagination côté client
  paginateClients(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClients = this.filteredClients.slice(startIndex, endIndex);
  }

  // Recherche
  onSearchChange(event: any): void {
    this.searchQuery = event.target.value.toLowerCase().trim();
    this.isSearchActive = this.searchQuery.length > 0;

    this.filteredClients = this.allClients.filter((client) =>
      Object.values(client).some((value) =>
        String(value).toLowerCase().includes(this.searchQuery)
      )
    );

    this.totalItems = this.filteredClients.length;
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
