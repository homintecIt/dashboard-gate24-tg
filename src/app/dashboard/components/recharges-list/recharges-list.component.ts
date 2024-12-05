// recharges-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recharge } from '../../interfaces/recharges';
import { RechargesService } from '../services/recharges.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';

@Component({
  selector: 'app-recharges-list',
  templateUrl: './recharges-list.component.html',
  styleUrls: ['./recharges-list.component.css']
})
export class RechargesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedRecharge?: Recharge;
  isEditModalOpen = false;
  isDetailsModalOpen = false;
  isStatusChanging = false;

  // Données
  recharge: Recharge[] = [];
  filteredRecharges: Recharge[] = [];

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
    private rechargeService: RechargesService,
    private modalService: BootstrapModalService
  ) {}

  ngOnInit(): void {
    // Écoute des recharge
    this.rechargeService.recharges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((recharge) => {
        this.recharge = recharge;
        this.filterRecharges();
      });

    // Écoute du chargement
    this.rechargeService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    // Chargement initial
    this.loadRecharges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des recharge
  loadRecharges(page: number = 1): void {
    this.rechargeService
      .loadRecharges(page, this.itemsPerPage)
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
          this.error = 'Impossible de charger les recharge';
        },
      });
  }

  // Filtrage des recharge
  filterRecharges(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRecharges = this.recharge.filter(
      (recharges) =>

      recharges.compte?.accountNumber.toLowerCase().includes(term) ||
      recharges.site.toLowerCase().includes(term) ||
      recharges.percepteur.toLowerCase().includes(term) ||
      recharges.montant.toLowerCase().includes(term)
    );
  }

  // Recherche
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.filterRecharges();
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
      this.loadRecharges(page);
    }
  }

  // Navigation entre pages
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.rechargeService
      .loadRecharges(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les recharge';
        },
      });
    this.filterRecharges();
  }

  // Rafraîchissement
  refreshData(): void {
    this.loadRecharges(this.currentPage);
  }
}

// export class RechargesListComponent implements OnInit, OnDestroy {
//   private destroy$ = new Subject<void>();

//   // Données
//   recharges: Recharge[] = [];
//   filteredRecharges: Recharge[] = [];

//   // Pagination
//   currentPage = 1;
//   itemsPerPage = 10 ;
//   totalItems = 0;
//   totalPages = 0;

//   // Recherche
//   searchTerm = '';

//   // États
//   loading = false;
//   error: string | null = null;

//   constructor(private rechargesService: RechargesService  ) {}

//   ngOnInit(): void {
//     // Écoute des recharges
//     this.rechargesService.recharges$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((recharges) => {

//         this.recharges = recharges;
//         this.filterRecharges();
//         console.log("os",this.recharges);
//       });

//     // Écoute du chargement
//     this.rechargesService.loading$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(loading => {
//         this.loading = loading;
//       });

//     // Chargement initial
//     this.loadRecharges();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   // Chargement des recharges
//   loadRecharges(page: number = 1): void {
//     this.rechargesService.loadRecharges(page, this.itemsPerPage)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response) => {
//           this.totalItems = response.meta.totalItems;
//           this.totalPages = response.meta.totalPages;
//           this.currentPage = response.meta.currentPage;
//         },
//         error: (err) => {
//           this.loading = !this.loading;
//           console.error('Erreur de chargement', err);
//           this.error = 'Impossible de charger les recharges';
//         }
//       });
//   }

//   // Filtrage des recharges
//   filterRecharges(): void {
//     const term = this.searchTerm.toLowerCase();
//     this.filteredRecharges = this.recharges.filter((recharge) =>

//       recharge.compte.accountNumber.toLowerCase().includes(term) ||
//       recharge.site.toLowerCase().includes(term) ||
//       recharge.percepteur.toLowerCase().includes(term) ||
//       recharge.montant.toLowerCase().includes(term)
//     );
//   }

//   // Recherche
//   onSearch(event: any): void {
//     this.searchTerm = event.target.value;
//     this.filterRecharges();
//   }

//   // Génération des pages
//   getPagesArray(): number[] {
//     const delta = 1;
//     const left = this.currentPage - delta;
//     const right = this.currentPage + delta;
//     const range: number[] = [];
//     const rangeWithDots: number[] = [];

//     // Générer la plage complète
//     for (let i = 1; i <= this.totalPages; i++) {
//       if (i === 1 || i === this.totalPages || (i >= left && i <= right)) {
//         range.push(i);
//       }
//     }

//     // Ajouter des points si nécessaire
//     for (let i = 0; i < range.length; i++) {
//       if (i > 0) {
//         if (range[i] - range[i - 1] > 1) {
//           rangeWithDots.push(-1); // Représente les points de suspension
//         }
//       }
//       rangeWithDots.push(range[i]);
//     }

//     return rangeWithDots;
//   }

//   // Changement de page
//   onPageChange(page: number): void {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.loadRecharges(page);
//     }
//   }

//     // Navigation entre pages
//     goToPage(page: number): void {
//       if (page < 1 || page > this.totalPages) return;

//       this.currentPage = page;
//       this.rechargesService.loadRecharges( this.currentPage, this.itemsPerPage)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response) => {
//           this.totalItems = response.meta.totalItems;
//           this.totalPages = response.meta.totalPages;
//           this.currentPage = response.meta.currentPage;
//         },
//         error: (err) => {
//           console.error('Erreur de chargement', err);
//           this.error = 'Impossible de charger les recharge';
//         }
//       });
//       this.filterRecharges();
//     }

//   // Rafraîchissement
//   refreshData(): void {
//     this.loadRecharges(this.currentPage);
//   }
// }

