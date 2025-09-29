import { data } from 'jquery';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { Account } from 'src/app/models/listeClient.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';
import Swal from 'sweetalert2';
import { swalAnimation } from 'src/app/misc/utilities.misc';
import { PermissionService } from 'src/app/services/permission.service';
import { SearchListComponent } from '../enroulements/search-list/search-list.component';
import { RechercheModalComponent } from '../enroulements/recherche-modal/recherche-modal.component';

@Component({
  selector: 'app-liste-des-comptes-clients',
  templateUrl: './liste-des-comptes-clients.component.html',
  styleUrls: ['./liste-des-comptes-clients.component.css'],
})
export class ListeDesComptesClientsComponent implements OnInit , OnDestroy{
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private searchSubjectMontant = new Subject<string>();

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
  searchTermMontant: number | undefined = undefined;

  // États
  loading = false;
  error: string | null = null;
  ticketData: any;

  constructor(
    private accountService: ListesClientService,
    private sweetAlert: SweetAlertService,
    public permissionService : PermissionService,

    private modalService: BootstrapModalService,

  ) {}


  ngOnInit(): void {
    // Écoute des account
    this.accountService.account$
      .pipe(takeUntil(this.destroy$))
      .subscribe((account) => {
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

    // Nouvelle configuration pour la recherche dynamique (par numéro de compte)
    this.searchSubject.pipe(
      debounceTime(300), // Attendre 300ms après la dernière frappe
      distinctUntilChanged(), // Ignorer si la valeur est identique à la précédente
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      // Réinitialiser à la page 1 lors d'une nouvelle recherche
      this.currentPage = 1;
      this.searchTerm = searchTerm ?? '';
      // Charger les comptes avec les filtres
      this.loadAccounts(this.currentPage, this.searchTerm, this.searchTermMontant);
    });

    // Recherche dynamique par montant (solde)
    this.searchSubjectMontant.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.currentPage = 1;
      const raw = (term ?? '').toString().trim();
      if (raw === '') {
        this.searchTermMontant = undefined; // champ vidé => ne pas envoyer 'solde'
      } else {
        const parsed = Number(raw.replace(',', '.'));
        this.searchTermMontant = isNaN(parsed) ? undefined : parsed;
      }
      this.loadAccounts(this.currentPage, this.searchTerm, this.searchTermMontant);
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

     newCompte() {
      this.modalService.openModal(SearchListComponent, "newCompte", 'modal-md modal-dialog-centered');

      }

        showCompte() {
          this.modalService.openModal(RechercheModalComponent, "accountNumber", 'modal-md modal-dialog-centered');

          }

  // Chargement des comptes avec filtres: numéro de compte et solde
  loadAccounts(page: number = 1, searchTerm?: string, solde?: number): void {
    this.accountService
      .loadAccounts(page, this.itemsPerPage, searchTerm, solde)
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

  onSearchMontant(event: any): void {
    const searchTermMontant = event.target.value;
    this.searchSubjectMontant.next(searchTermMontant);
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
      this.loadAccounts(page, this.searchTerm, this.searchTermMontant);
    }
  }

  // Navigation entre pages
  goToPage(page: number): void {
    console.log(this.searchTerm);
    if (page < 1 || page > this.totalPages) return;


    this.currentPage = page;
    console.log(this.currentPage);

    this.accountService
      .loadAccounts(this.currentPage, this.itemsPerPage,this.searchTerm,this.searchTermMontant)
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
    this.loadAccounts(this.currentPage, this.searchTerm, this.searchTermMontant);
  }

  // Suppression compte (via uuid)
  confirmDeleteCompte(item: Account): void {
    const compteName = `${item.client?.nom ?? ''} ${item.client?.prenom ?? ''}`.trim();
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous supprimer le compte « ${compteName || item.client?.uuid} » ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      confirmButtonColor: ' #0d6efd',
      cancelButtonColor: '#6c757d',
      allowOutsideClick: false,
      allowEscapeKey: false,
      reverseButtons: false,
      ...swalAnimation,
    }).then((result) => {
      if (result.isConfirmed && item.client?.uuid) {
        this.deleteCompte(item.accountNumber!);
      }
    });

  }


    printingCompte(item: Account): void {
     this.accountService.getRechargesbyAccount(item.accountNumber!).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.ticketData = data;
      this.printReceiptContent();

      },
      error: (error) => {
        this.sweetAlert.toastError('Erreur !', 5000, (error?.error?.message || error?.error?.error) || 'Le service est temporairement indisponible');
      }
    });
  }

  private deleteClient(uuid: string): void {
    this.accountService.deleteClient(uuid).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        // Optimistic update
        this.account = this.account.filter(a => a.client?.uuid !== uuid);
        this.filterAccounts();
        this.sweetAlert.toastSuccess('Client supprimé avec succès', 3000);
        // Reload current page to sync with backend counts
        this.loadAccounts(this.currentPage, this.searchTerm);
      },
      error: (error) => {
        this.sweetAlert.toastError('Erreur !', 5000, (error?.error?.message || error?.error?.error) || 'Le service est temporairement indisponible');
      }
    });
  }




  private deleteCompte(account: string): void {
    this.accountService.deleteAccount(account).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        // Optimistic update
        //this.account = this.account.filter(a => a.client?.uuid !== uuid);
        this.filterAccounts();
        this.sweetAlert.toastSuccess('Compte supprimé avec succès', 3000);
        // Reload current page to sync with backend counts
        this.loadAccounts(this.currentPage, this.searchTerm);
      },
      error: (error) => {
        this.sweetAlert.toastError('Erreur !', 5000, (error?.error?.message || error?.error?.error) || 'Le service est temporairement indisponible');
      }
    });
  }

     formatToCurrency(value:any) {
    const number = Number(value);
    if (isNaN(number)) {
      throw new Error('Valeur invalide. Impossible de convertir en nombre.');
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(number);
  }

  printReceiptContent() {
    if (!this.ticketData) {
     /// this.sweetAlertService.toastError('Données du ticket manquantes', 5000);
      return;
    }

    const montant  = this.formatToCurrency(this.ticketData.recharge.montant);

  const receiptHtml = `
<html>
  <head>
    <title>Reçu de recharge<</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 10px;
      }
      .text-center { text-align: center; }
      .text-end { text-align: end; }
      .mb-3 { margin-bottom: 15px; }
      footer {
        text-align: center;
        margin-top: 20px;
      }
      @page { margin: 0; }
    </style>
  </head>
  <body onload="window.print(); window.close();">
    <div class="d-flex flex-column align-items-center justify-content-between mb-4 text-center">
      <img src="/assets/img/logo.png" alt="logo" width="50">
      <h5>Reçu de recharge<</h5>
      <p>Date : ${new Date().toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
      })}</p>
    </div>

    <div class="mb-3">
      <p><strong>Client :</strong> ${(this.ticketData.compte.client.nom || '-')}  ${this.ticketData.compte.client.prenom || '-'}</p>
      <p><strong>Numéro de compte :</strong> ${this.ticketData.compte?.accountNumber || '-'}</p>
      <p><strong>Montant :</strong> ${this.ticketData.recharge?.montant ? this.ticketData.recharge.montant : '-'}</p>
      <p><strong>Solde :</strong> ${this.ticketData.recharge?.montant_apres_recharge ? this.ticketData.recharge.montant_apres_recharge.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }) : '-'}</p>
    </div>

    <footer>
      <p>Merci pour votre paiement !</p>
      <p><em>Safer</em></p>
    </footer>
  </body>
</html>
`;


    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
    } else {
    }
  }

}
