import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import {
  StatusUpdatePayload,
  Subscription,
  SubscriptionService,
} from '../services/subscribe-list.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { SubscriptionEditModalComponent } from './subscription-edit-modal/subscription-edit-modal.component';
import { SubscriptionDetailsModalComponent } from './subscription-details-modal/subscription-details-modal.component';
import Swal from 'sweetalert2';
import { swalAnimation } from 'src/app/misc/utilities.misc';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});
@Component({
  selector: 'app-subscribe-list',
  templateUrl: './subscribe-list.component.html',
  styleUrls: ['./subscribe-list.component.css'],
})
export class SubscribeListComponent implements OnInit, OnDestroy {
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

  constructor(
    private subscrptionService: SubscriptionService,
    private modalService: BootstrapModalService
  ) {}

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
        } le type "${subscription.targCode}" ?`,
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
            targId: subscription.targId,
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

  ngOnInit(): void {
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
    this.loadSubscriptions();

    // Nouvelle configuration pour la recherche dynamique
    this.searchSubject.pipe(
      debounceTime(300), // Attendre 300ms après la dernière frappe
      distinctUntilChanged(), // Ignorer si la valeur est identique à la précédente
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      // Réinitialiser à la page 1 lors d'une nouvelle recherche
      this.currentPage = 1;

      // Charger les abonnements avec le terme de recherche
      this.loadSubscriptions(this.currentPage, searchTerm);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  // Chargement desloadSubscriptions pour accepter un terme de recherche
  loadSubscriptions(page: number = 1, searchTerm?: string): void {
    this.subscrptionService
      .loadSubscriptions(page, this.itemsPerPage, searchTerm)
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
        subscription.targId.toLowerCase().includes(term) ||
        subscription.targCode.toLowerCase().includes(term) ||
        subscription.plaque?.toLowerCase().includes(term)
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
}
