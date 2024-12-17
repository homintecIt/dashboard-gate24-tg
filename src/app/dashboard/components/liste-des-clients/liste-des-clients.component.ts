import { Component, OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { Client } from 'src/app/models/listeClient.model';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { EditClientModalComponent } from './edit-client-modal/edit-client-modal.component';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
interface FilterPayload {
  nom?: string;
  prenom?: string;
}

@Component({
  selector: 'app-liste-des-clients',
  templateUrl: './liste-des-clients.component.html',
  styleUrls: ['./liste-des-clients.component.css'],
})

export class ListeDesClientsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  selectedClient?: Client;
  isEditModalOpen = false;
  isDetailsModalOpen = false;
  isStatusChanging = false;

  // Données
  clients: Client[] = [];
  filteredClients: Client[] = [];

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
    private clientService: ListesClientService,
    private modalService: BootstrapModalService
  ) {}



  openDetailsModal(client: Client): void {
    console.log('Ouverture des détails:', client);

    this.modalService.openModal(
      EditClientModalComponent,
      client,
      'modal-lg'
    );

    // Souscrire aux événements du modal si nécessaire
    this.modalService.modalRef.onHidden?.subscribe(() => {
      // this.refreshData(); // Rafraîchir la liste après fermeture du modal
    });
  }

  ngOnInit(): void {
    // Écoute des clients
    this.clientService.client$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clients) => {
        this.clients = clients;
        this.filterClients();
      });

    // Écoute du chargement
    this.clientService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });


    // Chargement initial
    this.loadClients();

    // fonction d'initalisation de recherche

     // Nouvelle configuration pour la recherche dynamique
     this.searchSubject.pipe(
      debounceTime(300), // Attendre 300ms après la dernière frappe
      distinctUntilChanged(), // Ignorer si la valeur est identique à la précédente
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      // Réinitialiser à la page 1 lors d'une nouvelle recherche
      this.currentPage = 1;

      // Charger les abonnements avec le terme de recherche
      this.loadClients(this.currentPage, searchTerm);
    });
    // this.searchSubject.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   takeUntil(this.destroy$)
    // ).subscribe(searchTerm => {
    //   // Réinitialiser à la page 1 lors d'une nouvelle recherche
    //   this.currentPage = 1;

    //   // Préparer le filtre
    //   const filterPayload = this.prepareSearchFilter(searchTerm);

    //   // Charger les abonnements
    //   // - Si filterPayload est undefined, aucun filtre ne sera appliqué
    //   this.loadClients(this.currentPage, filterPayload);
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Méthode pour préparer le filtre de recherche
  prepareSearchFilter(searchTerm: string): FilterPayload | undefined {
  // Trim et supprimer les espaces multiples
  const trimmedTerm = searchTerm.trim().replace(/\s+/g, ' ');

  // Si la recherche est vide, retourner undefined
  if (!trimmedTerm) return undefined;

  // Séparer les mots
  const terms = trimmedTerm.split(' ');

  // Initialiser le payload de filtre
  const filter: FilterPayload = {};

  // Cas où un seul terme est saisi
  if (terms.length === 1) {
    // Le terme unique peut être soit un nom, soit un prénom
    filter.nom = terms[0];
    filter.prenom = terms[0];
    // Ou filter.prenom = terms[0];
    return filter;
  }

  // Cas avec plusieurs termes
  // On suppose que le dernier terme est le prénom, les autres sont le nom
  filter.prenom = terms[terms.length - 1];
  filter.nom = terms.slice(0, -1).join(' ');

  return filter;
}


   // Modifier loadSubscriptions pour accepter un payload de filtre
   loadClients(page: number = 1, filter?: string | undefined): void {
    this.clientService
      .loadClients(page, this.itemsPerPage, filter)
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
          this.error = 'Impossible de charger les clientd';
        },
      });
  }

  // Filtrage des clients
  filterClients(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(
      (client) =>
        client?.nom?.toLowerCase().includes(term)/*  ||
        client.targId.toLowerCase().includes(term) ||
        client.targCode.toLowerCase().includes(term) ||
        client.plaque?.toLowerCase().includes(term)*/
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
      this.loadClients(page);
    }
  }

  // Navigation entre pages
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.clientService
      .loadClients(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les clients';
        },
      });
    this.filterClients();
  }

  // Rafraîchissement
  refreshData(): void {
    this.loadClients(this.currentPage);
  }
}


  // allClients: Client[] = [];
  // filteredClients: Client[] = [];
  // paginatedClients: Client[] = [];
  // totalPages: number = 0;
  // totalItems: number = 0;
  // currentPage: number = 1;
  // itemsPerPage: number = 10;
  // searchQuery: string = '';
  // isSearchActive: boolean = false;

  // constructor(private listesClientService: ListesClientService,
  //   private modalService: BootstrapModalService

  // ) {}

  // openEditModal(client: Client) {
  //   console.log('VerifieClient', client)
  //   this.modalService.openModal(EditClientModalComponent, client,'modal-lg');
  // }

  // refreshClients(): void {
  //   this.listesClientService.getAllClients().subscribe({
  //     next: (response) => {
  //       this.allClients = response.items; // Mets à jour la liste affichée
  //       console.log('Liste des clients actualisée', this.allClients);
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors de la récupération des clients', error);
  //     }
  //   });
  // }

  // handleClientUpdate(updatedClient: any): void {
  //   const index = this.allClients.findIndex(client => client.uuid === updatedClient.uuid);
  //   if (index !== -1) {
  //     this.allClients[index] = updatedClient;
  //     this.filteredClients = [...this.allClients];
  //   this.loadPage(this.currentPage);
  //   } else {
  //     this.refreshClients();
  //   }
  // }


  // ngOnInit(): void {
  //   // Charger tous les clients une seule fois
  //   this.listesClientService.getAllClients().subscribe({
  //     next: (response) => {
  //       this.allClients = response.items;
  //       this.filteredClients = [...this.allClients];
  //       this.totalItems = this.filteredClients.length;
  //       this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  //       this.loadPage(this.currentPage);
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors du chargement des clients:', err);
  //     },
  //   });
  //   this.refreshClients();
  // }

  // // Gestion des pages
  // loadPage(page: number): void {
  //   if (this.isSearchActive) {
  //     this.paginateClients(page);
  //   } else {
  //     this.paginateClients(page);
  //   }
  // }

  // // Pagination côté client
  // paginateClients(page: number): void {
  //   this.currentPage = page;
  //   const startIndex = (page - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.paginatedClients = this.filteredClients.slice(startIndex, endIndex);
  // }

  // // Recherche
  // onSearchChange(event: any): void {
  //   this.searchQuery = event.target.value.toLowerCase().trim();
  //   this.isSearchActive = this.searchQuery.length > 0;

  //   this.filteredClients = this.allClients.filter((client) =>
  //     Object.values(client).some((value) =>
  //       String(value).toLowerCase().includes(this.searchQuery)
  //     )
  //   );

  //   this.totalItems = this.filteredClients.length;
  //   this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  //   this.loadPage(1); // Revenir à la première page des résultats
  // }

  // // Changement de page
  // onPageChange(newPage: number): void {
  //   if (newPage > 0 && newPage <= this.totalPages) {
  //     this.loadPage(newPage);
  //   }
  // }

  // // Numéros des pages à afficher
  // getPageNumbers(): number[] {
  //   const maxPagesToShow = 3;
  //   let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
  //   let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

  //   if (endPage - startPage + 1 < maxPagesToShow) {
  //     startPage = Math.max(1, endPage - maxPagesToShow + 1);
  //   }

  //   return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  // }
