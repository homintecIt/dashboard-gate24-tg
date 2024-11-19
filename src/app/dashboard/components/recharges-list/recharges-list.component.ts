

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Recharge } from '../../interfaces/recharges';
import { RechargeService } from '../services/recharges.service';

@Component({
  selector: 'app-recharges-list',
  templateUrl: './recharges-list.component.html',
  styleUrls: ['./recharges-list.component.css']
})
export class RechargesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  recharges: Recharge[] = [];
  filteredRecharges: Recharge[] = [];

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

  constructor(private rechargeService: RechargeService) {
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
    this.rechargeService.recharges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(recharges => {
        this.recharges = recharges;
        this.filterAndPaginate();
      });

    this.rechargeService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.loadRecharges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRecharges(): void {
    this.rechargeService.loadRecharges().subscribe({
      error: (err) => {
        console.error('Erreur de chargement', err);
        this.error = 'Impossible de charger les recharges';
      }
    });
  }

  refreshData(): void {
    this.rechargeService.refreshRecharges().subscribe();
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);
  }

  filterAndPaginate(): void {
    let filtered = [...this.recharges];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.compte.accountNumber.toLowerCase().includes(term) ||
        item.montant.toString().includes(term) ||
        item.refer?.toLowerCase().includes(term) ||
        item.site.toLowerCase().includes(term)
      );
    }

    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredRecharges = filtered.slice(startIndex, startIndex + this.itemsPerPage);
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
