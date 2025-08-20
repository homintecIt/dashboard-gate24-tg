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
import { AddTagCompteComponent } from '../add-tag-compte/add-tag-compte.component';
import { SaveTagComponent } from '../save-tag/save-tag.component';
import { SaveTagWithouAmountComponent } from '../save-tag-without-amount/save-tag-without-amount.component';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});
@Component({
  selector: 'app-subscribe-list-compte',
  templateUrl: './subscribe-list-compte.component.html',
  styleUrls: ['./subscribe-list-compte.component.css'],
})
export class SubscribeListCompteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  selectedSubscription?: Subscription;
  isEditModalOpen = false;
  isDetailsModalOpen = false;
  isStatusChanging = false;

  // Données
  subscrption: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];

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
accountNumber:any;

  constructor(
    private subscrptionService: SubscriptionService,
    private modalService: BootstrapModalService,
        private generalService: GeneralService,
    private sweetAlertService: SweetAlertService,


  ) {}


  ngOnInit(): void {

  this.generalService.successEvent.subscribe((data: any) => {
    this.accountNumber = data.accountNumber ?? data.compte.accountNumber;
    storageHelper.local.store("accountNumber",this.accountNumber);
      this.loadSubscriptions();
    });
    this.accountNumber = storageHelper.local.get("accountNumber")
    // Écoute des subscrption
    this.subscrptionService.subscription$
      .pipe(takeUntil(this.destroy$))
      .subscribe((subscrption) => {
        this.subscrption = subscrption;
        this.filterSubscriptions();
      });

    // Écoute du chargement
    this.subscrptionService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    // Chargement initial
   /// this.loadSubscriptions();

    // Nouvelle configuration pour la recherche dynamique
    this.searchSubject.pipe(
      debounceTime(300), // Attendre 300ms après la dernière frappe
      distinctUntilChanged(), // Ignorer si la valeur est identique à la précédente
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      // Réinitialiser à la page 1 lors d'une nouvelle recherche
      this.currentPage = 1;


      if (!searchTerm) {
         const accountNumber = storageHelper.local.get("accountNumber");
      this.accountNumber = accountNumber;
      this.loadSubscriptions(this.currentPage );
      }
      // Charger les abonnements avec le terme de recherche
      this.loadSubscriptions(this.currentPage, searchTerm);
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


   addTag() {
     this.modalService.openModal(SaveTagWithouAmountComponent, this.accountNumber, 'modal-md');
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

  // Changement de page
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSubscriptions(page);
    }
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

}
