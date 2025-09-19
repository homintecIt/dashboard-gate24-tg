import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MonthlyReportService, MonthlyReport } from '../services/monthly-report.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  site: string = '';
  montlyReports: MonthlyReport[] = [];
  filteredReports: MonthlyReport[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Recherche et filtres
  searchTerm = '';
  dateStart: string = '';
  dateEnd: string = '';
  targCode: string = '';

  // États
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private monthlyReportService: MonthlyReportService
  ) {}

  ngOnInit(): void {
    // Récupérer le site des paramètres de route
    this.route.queryParams.subscribe((params) => {
      this.site = params['site'] || '';

      // Chargement initial
      this.loadReports();
    });

    // Écoute des rapports
    this.monthlyReportService.monthlyReports$
      .pipe(takeUntil(this.destroy$))
      .subscribe((reports) => {
        this.montlyReports = reports;
        this.filteredReports = reports;
      });

    // Écoute du chargement
    this.monthlyReportService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    // Configuration de la recherche dynamique
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.currentPage = 1;
      this.loadReports(this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des rapports
  loadReports(page: number = 1): void {
    this.monthlyReportService
      .loadReports(page, this.itemsPerPage, this.dateStart, this.dateEnd, this.site, this.targCode)
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

  // Recherche
  onSearch(event: any): void {
    const searchTerm = event.target.value;
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  // Activation de la date de fin
  onDateStartChange(): void {
    // Activer le champ de date de fin
  }

  // Recherche avec filtres
  searchWithFilters(): void {
    this.currentPage = 1;
    this.loadReports();
  }

  // Génération des pages
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

  // Changement de page
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadReports(page);
    }
  }

  // Rafraîchissement des données
  refreshData(): void {
    this.loadReports(this.currentPage);
  }
}
