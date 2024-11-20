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
  allClients: ListeClientService[] = []; // Toutes les données
  filteredClients: ListeClientService[] = []; // Données filtrées
  paginatedClients: ListeClientService[] = []; // Données paginées
totalPages:number=0;
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  isLoading: boolean = false;
  Math=Math;

  constructor(private listesClientService: ListesClientService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadPage(1);
    this.listesClientService.getAllClients().subscribe({
      next: (response) => {
        this.allClients = response.items;
        console.log(this.allClients) // Assurez-vous que la structure correspond;
        this.filterClients(); // Appliquer le filtre et paginer
        this.isLoading = false;
      },
      error: (err:any) => {
        console.error('Erreur lors du chargement des données:', err);
        this.isLoading = false;
      },
    });
  }


  loadPage(page: number): void {
    this.isLoading = true;

    this.listesClientService.getPaginatedClients(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.filteredClients = response.items; // Mise à jour des clients pour la page
        this.totalItems = response.meta.totalItems; // Nombre total d'éléments
        this.totalPages = response.meta.totalPages; // Valeur retournée par l'API
        this.currentPage = response.meta.currentPage; // Page actuelle
        this.paginateClients(); // Génération de la vue paginée
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données paginées:', err);
        this.isLoading = false;
      },
    });
  }


  // Filtrage des données
  filterClients(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredClients = this.allClients.filter((client) =>
      Object.values(client).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    console.log('Clients filtrés:', this.filteredClients);
    this.totalItems = this.filteredClients.length;
    this.paginateClients(); // Appliquer la pagination
  }

  // Pagination des données
  paginateClients(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClients = this.filteredClients.slice(startIndex, endIndex);
    console.log('Clients paginés:', this.paginatedClients); // Vérifiez les données paginées
  }

  // Gestion de la recherche
  onSearchChange(event: any): void {
    this.searchQuery = event.target.value;
    this.currentPage = 1; // Revenir à la première page
    this.filterClients();
  }

  // Gestion du changement de page
  onPageChange(newPage: number): void {
    if (newPage !== this.currentPage) {
      this.currentPage = newPage;

      // Si une recherche est active, on utilise les données locales filtrées
      if (this.searchQuery) {
        this.paginateClients(); // Appliquer la pagination sur les données filtrées
      } else {
        this.loadPage(newPage); // Charger les données depuis l'API
      }
    }
  }



  getPageNumbers(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const maxPagesToShow = 5; // Nombre maximal de pages à afficher

    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }




}
