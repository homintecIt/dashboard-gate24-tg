import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import Swal from 'sweetalert2';
import { swalAnimation } from 'src/app/misc/utilities.misc';
import { GeneralService } from 'src/app/services/general.service';
import { StatusUpdatePayload, Subscription, SubscriptionService } from '../../services/subscribe-list.service';
import { SubscriptionEditModalComponent } from '../../subscribe-list/subscription-edit-modal/subscription-edit-modal.component';
import { SubscriptionDetailsModalComponent } from '../../subscribe-list/subscription-details-modal/subscription-details-modal.component';
import { storageHelper } from 'src/app/misc/storage.misc';
import { SweetAlertService } from 'src/app/services/sweetalert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TransfertTagComponent } from '../transfert-tag/transfert-tag.component';
import { Transaction, TransactionResponse, VTransaction } from 'src/app/dashboard/interfaces/transaction';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});
@Component({
  selector: 'app-transaction-list-subscribe',
  templateUrl: './transaction-list-subscribe.component.html',
  styleUrls: ['./transaction-list-subscribe.component.css'],
})
export class TransactionListSubscribeComponent implements OnInit, OnDestroy {


    transactions: VTransaction[] = [];
    loading = false;
    error: string | null = null;
    searchTerm = '';
    selectedType = '';

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;
    totalItems = 0;
    totalPages = 1;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  selectedSubscription?: Subscription;
  isEditModalOpen = false;
  isDetailsModalOpen = false;
  isStatusChanging = false;

  // Données
  subscrption: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];


accountNumber:any;

  constructor(
    private subscrptionService: SubscriptionService,
    private modalService: BootstrapModalService,
        private generalService: GeneralService,
    private sweetAlertService: SweetAlertService,
    private transactionService: TransactionService,
    private route: ActivatedRoute,


  ) {}


  ngOnInit(): void {

   this.route.queryParams.subscribe(params => {
      if (params['tag']) {
        this.searchTerm = params['tag'];
      }
      this.loadTransactions();
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }


  goBack() {
    window.history.back();
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

      const body ={
        page : this.currentPage,
        limit : 10,
        tagId : this.searchTerm
      }
      this.transactionService
        .loadTransactions(
          body.page, body.limit, '', '', undefined, undefined, undefined, undefined, body.tagId, undefined  
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

    onSearchs(): void {
      this.currentPage = 1; // Réinitialiser à la première page lors d'une nouvelle recherche
      this.loadTransactions();
    }

      // Exposer l'objet Math pour le template
  Math = Math;

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      console.log("cuurrent page", this.currentPage);

      this.loadTransactions();
    }
  }


    resetFilters(): void {
      this.searchTerm = '';
      this.selectedType = '';
      this.currentPage = 1;
      this.loadTransactions();
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

  // Chargement desloadSubscriptions pour accepter un terme de recherche
  loadSubscriptions(page: number = 1, searchTerm?: string): void {
    this.subscrptionService
      .loadSubscriptions(page, this.itemsPerPage, searchTerm,this.accountNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;

          // Supprimer le filtrage local
          // this.filteredSubscriptions = response.items;
        },
        error: (err) => {
          this.loading = !this.loading;
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les abonnements';
        },
      });
  }
  // Filtrage des subscrption
  filterSubscriptions(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredSubscriptions = this.subscrption.filter(
      (subscription) =>
        subscription.compte.accountNumber.toLowerCase().includes(term) ||
        subscription.tagId.toLowerCase().includes(term) ||
        subscription.tagCode.toLowerCase().includes(term) ||
        subscription.plaque?.toLowerCase().includes(term)
    );
  }

  //  la méthode onSearch
  onSearch(event: any): void {
    const searchTerm = event.target.value;
    this.searchSubject.next(searchTerm);
  }

  onStatusToggle(subscription: Subscription): void {
  // Stocker le statut initial
  const initialStatus = subscription.statutTarg;

  // Désactiver le switch pendant le processus
  this.isStatusChanging = true;

    swalWithBootstrapButtons
      .fire({
        title: 'Êtes-vous sûr ?',
        text: `Voulez-vous vraiment ${
          subscription.statutTarg === 'actived' ? 'désactiver' : 'activer'
        } le type "${subscription.tagCode}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#405189',
        cancelButtonColor: '#6c757d',
        allowOutsideClick: false,
        allowEscapeKey: false,
        reverseButtons: false,
        ...swalAnimation,
      })
      .then((result) => {
        // Si l'utilisateur annule, on rétablit le statut initial
        if (result.dismiss === Swal.DismissReason.cancel) {
          subscription.statutTarg = initialStatus;
          this.isStatusChanging = false;
          return;
        }

        if (result.isConfirmed) {
          // Déterminer le nouveau statut
          const newStatus =
            subscription.statutTarg === 'actived' ? false : true;

          // Préparer la payload
          const payload: StatusUpdatePayload = {
            targId: subscription.tagId,
            isActive: newStatus,
          };

          // Appeler le service pour mettre à jour le statut
          this.subscrptionService
            .updateSubscriptionStatus(payload)
            .pipe(
              takeUntil(this.destroy$),
              finalize(() => {
                // Réactiver le switch après la requête
                this.isStatusChanging = false;
              })
            )
            .subscribe(
              () => {
                subscription.statutTarg = newStatus ? 'actived' : 'desactived';
                Swal.fire('Succès', `Le statut a été mis à jour.`, 'success');
              },
              (error) => {
                // En cas d'erreur, rétablir le statut initial
                subscription.statutTarg = initialStatus;
                console.error('Erreur lors de la mise à jour du statut', error);
                Swal.fire('Erreur', 'La mise à jour a échoué.', 'error');
              }
            );
        } else {
          // Réactiver le switch si aucune action n'est prise
          this.isStatusChanging = false;
        }
      });
  }

  addTag(compteId: number) {
    this.modalService.openModal(
      SubscriptionEditModalComponent,
      compteId,
      'modal-lg'
    );

    // Souscrire aux événements du modal si nécessaire
    this.modalService.modalRef.onHidden?.subscribe(() => {
      this.refreshData(); // Rafraîchir la liste après fermeture du modal
    });
  }

  openDetailsModal(subscription: Subscription): void {
    console.log('Ouverture des détails:', subscription);

    this.modalService.openModal(
      SubscriptionDetailsModalComponent,
      subscription,
      'modal-lg'
    );

    // Souscrire aux événements du modal si nécessaire
    this.modalService.modalRef.onHidden?.subscribe(() => {
      // this.refreshData(); // Rafraîchir la liste après fermeture du modal
    });
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

  getTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'credit': 'Crédit',
      'debit': 'Débit'
    };
    return typeMap[type] || type;
  }

  // Navigation entre pages
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.subscrptionService
      .loadSubscriptions(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les subscrption';
        },
      });
    this.filterSubscriptions();
  }

  // Rafraîchissement
  refreshData(): void {
    this.loadSubscriptions(this.currentPage);
  }


   dialogModalChangeModePassage(data: any) {
    const status = data.isExo ? 'désactiver' : 'activer';
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous ${status} le mode exoneré pour ${data.typeTarg}: "${data.tagCode}" ?`,
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
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.changeExoStatus(data);
        } else {
        }
      });
  }

    changeExoStatus(item: any) {
    const data = {
      isExo: item.isExo ? false : true,
      tagId: item.tagId,
    }

    this.generalService.toggleExoStatus(data).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.generalService.successEvent.emit(data);
        },  500)
        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }

  deleteTag(data: any) {
    this.generalService.deleteTag(data).subscribe({
      next: (data) => {
        setTimeout (() => {
          this.generalService.successEvent.emit(data);
        }, 500)
        this.sweetAlertService.toastSuccess('Tag supprimé avec succès', 3000);
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }

  restaurerStatus(item: any) {
    const data = {
      isActive:false,
      tagId: item.tagId,
    }
    this.generalService.toggleStatus(data).subscribe({
      next: (data) => {
        item.statutTarg = 'disabled';

        //console.log(data)
        this.generalService.successEvent.emit(data);
        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }

  changeStatus(item: any) {
    const data = {
      isActive: item.statutTarg === 'actived' ? false : true,
      tagId: item.tagId,
    }

    this.generalService.toggleStatus(data).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.generalService.successEvent.emit(data);
        }, 500)

        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }

    dialogModalStatus(data: any) {
    const status = data.statutTarg === 'actived' ? 'désactiver' : 'activer';
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous ${status}  ${data.typeTarg}: "${data.tagCode}" ?`,
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
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.changeStatus(data);
        } else {
        }
      });
  }
 dialogModalRestaureStatus(data: any) {
    const status = 'Restaurer';
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous ${status}  ${data.typeTarg}: "${data.tagCode}" ?`,
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
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.restaurerStatus(data);
        } else {
        }
      });
  }

  dialogModalDelete(data: any) {
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous supprimer ${data.typeTarg}: "${data.tagCode}" ?`,
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
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteTag(data.id);
        } else {
        }
      });
  }


    transferClient(data: any) {
      const compte = Array.isArray(data?.compte);

          const dataAll ={
              abonnement : data,
              comptes: data.compte
          }


          console.log("compte",data);


    this.modalService.openModal(TransfertTagComponent, dataAll, 'modal-md modal-dialog-centered');
  }



  goToTransactionPage(data:any){

  }




  onExportExcel() {


    let filters: any;
   this.route.queryParams.subscribe(params => {
  filters = {
    type: "debit",
    tagCode: params['tag'],
  };
 });
  
this.transactionService.exportExcel(filters).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

onExportPdf() {
   let filters: any;
   this.route.queryParams.subscribe(params => {
  filters = {
    type: "debit",
    tagCode: params['tag'],
  };
 });
this.transactionService.exportPdf(filters).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
     a.download = 'transactions.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });

}

}
