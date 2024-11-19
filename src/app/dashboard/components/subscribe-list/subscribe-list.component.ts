// src/app/dashboard/components/subscribe-list/subscribe-list.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Subscription, SubscriptionService } from '../services/subscribe-list.service';

@Component({
  selector: 'app-subscribe-list',
  templateUrl: './subscribe-list.component.html',
  styleUrls: ['./subscribe-list.component.css']
})
// export class SubscribeListComponent implements OnInit {
//   subscriptions: Subscription[] = [];
//   loading = false;
//   error: string | null = null;

//   // Paramètres de pagination
//   currentPage = 1;
//   itemsPerPage = 10;
//   totalItems = 0;

//   // Paramètres de recherche
//   searchTerm = '';

//   constructor(private apiService: ApiService) {}

//   ngOnInit() {
//     this.fetchSubscriptions();
//   }

//   fetchSubscriptions() {
//     this.loading = true;

//     const payload = {
//       draw: this.currentPage,
//       start: (this.currentPage - 1) * this.itemsPerPage,
//       length: this.itemsPerPage,
//       search: {
//         value: this.searchTerm,
//         regex: false
//       },
//       order: [{ column: 0, dir: 'desc' }],
//       columns: [
//         { data: 'targCode', searchable: true, orderable: true },
//         { data: 'typeTarg', searchable: true, orderable: true },
//         { data: 'statutTarg', searchable: true, orderable: true }
//       ]
//     };

//     this.apiService.post<SubscriptionResponse>('/subscription/all', payload)
//       .subscribe({
//         next: (response) => {
//           this.subscriptions = response.items;
//           this.totalItems = response.meta.totalItems;
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error('Erreur de chargement', err);
//           this.error = 'Impossible de charger les abonnements';
//           this.loading = false;
//         }
//       });
//   }

//   // Méthode de recherche
//   onSearch() {
//     this.currentPage = 1; // Réinitialiser à la première page
//     this.fetchSubscriptions();
//   }

//   // Méthode de pagination
//   onPageChange(page: number) {
//     this.currentPage = page;
//     this.fetchSubscriptions();
//   }
// }


export class SubscribeListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  subscription: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Recherche
  searchTerm = '';
  private searchSubject = new Subject<string>();

  loading = false;
  error: string | null = null;

  constructor(private subscriptionService: SubscriptionService) {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchTerm = term;
      this.filterAndPaginate();
    });
  }

  ngOnInit(): void {
    this.subscriptionService.subscription$
      .pipe(takeUntil(this.destroy$))
      .subscribe(subscription => {
        this.subscription = subscription;
        this.filterAndPaginate();
      });

    this.subscriptionService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.loadSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSubscriptions(): void {
    this.subscriptionService.loadSubscriptions().subscribe({
      error: (err) => {
        console.error('Erreur de chargement', err);
        this.error = 'Impossible de charger les subscription';
      }
    });
  }

  refreshData(): void {
    this.subscriptionService.refreshSubscriptions().subscribe();
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);
  }

  filterAndPaginate(): void {
    let filtered = [...this.subscription];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.compte.accountNumber.toLowerCase().includes(term)/*  ||
        item.montant.toString().includes(term) ||
        item.refer?.toLowerCase().includes(term) ||
        item.site.toLowerCase().includes(term) */
      );
    }

    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredSubscriptions = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.filterAndPaginate();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
