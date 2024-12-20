import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MonthlyReportService } from '../services/monthly-report.service';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Données
  reports: any[] = [];
  sites: any[] = [];
  
  // Filtres
  selectedSite: string = '';
  startDate: string = '';
  endDate: string = '';
  targCode: string = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // États
  loading = false;
  error: string | null = null;

  constructor(private reportService: MonthlyReportService) {}

  ngOnInit(): void {
    // Chargement des sites
    this.reportService.getDropdownOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sites => this.sites = sites);

    // Écoute des rapports
    this.reportService.reports$
      .pipe(takeUntil(this.destroy$))
      .subscribe(reports => {
        this.reports = reports;
      });

    // Écoute du chargement
    this.reportService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });
      this.loadReports();
    // Configuration de la recherche par targCode
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(targCode => {
      this.currentPage = 1;
      this.loadReports();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReports(): void {
    const payload = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      order: ["string"],
      search: {},
      dateStart: this.startDate || '',
      dateEnd: this.endDate || '',
      site: this.selectedSite,
      targCode: this.targCode
    };

    this.reportService.getReports(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.meta.totalItems;
          this.totalPages = response.meta.totalPages;
          this.currentPage = response.meta.currentPage;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les rapports';
        }
      });
  }

  onSearch(event: any): void {
    this.targCode = event.target.value;
    this.searchSubject.next(this.targCode);
  }

  onDateStartChange(): void {
    if (this.startDate) {
      this.endDate = '';  // Reset end date when start date changes
    }
  }

  getPagesArray(): number[] {
    const delta = 1;
    const left = this.currentPage - delta;
    const right = this.currentPage + delta;
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    for (let i = 0; i < range.length; i++) {
      if (i > 0) {
        if (range[i] - range[i - 1] > 1) {
          rangeWithDots.push(-1);
        }
      }
      rangeWithDots.push(range[i]);
    }

    return rangeWithDots;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadReports();
    }
  }

  refreshData(): void {
    this.loadReports();
  }
}
