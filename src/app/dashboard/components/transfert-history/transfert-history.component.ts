import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transfert-history',
  templateUrl: './transfert-history.component.html',
  styleUrls: ['./transfert-history.component.css']
})
export class TransfertHistoryComponent implements OnInit {
  activeTab: 'solde' | 'tag' = 'solde';
  loading: boolean = false;
  soldeTransfers: any[] = [];
  tagTransfers: any[] = [];
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Filter properties
  showFilters: boolean = false;
  filterDateFrom: string = '';
  filterDateTo: string = '';
  filterStatus: string = '';
  filterAccount: string = '';

  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.loadSoldeTransfers();
  }

  switchTab(tab: 'solde' | 'tag'): void {
    this.activeTab = tab;
    this.currentPage = 1; // Reset to first page when switching tabs
    this.resetFilters();
    if (tab === 'solde') {
      this.loadSoldeTransfers();
    } else {
      this.loadTagTransfers();
    }
  }

  refreshData(): void {
    this.currentPage = 1;
    if (this.activeTab === 'solde') {
      this.loadSoldeTransfers();
    } else {
      this.loadTagTransfers();
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.filterStatus = '';
    this.filterAccount = '';
    this.currentPage = 1;
  }

  applyFilters(): void {
    this.currentPage = 1;
    if (this.activeTab === 'solde') {
      this.loadSoldeTransfers();
    } else {
      this.loadTagTransfers();
    }
  }

  loadSoldeTransfers(): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      type: 'solde'
    };
    
    if (this.filterDateFrom) params.dateFrom = this.filterDateFrom;
    if (this.filterDateTo) params.dateTo = this.filterDateTo;
    if (this.filterStatus) params.status = this.filterStatus;
    if (this.filterAccount) params.account = this.filterAccount;

    this.generalService.getTransfersPaginated(params).subscribe({
      next: (response) => {
        this.soldeTransfers = response.data || [];
        this.totalItems = response.total || 0;
        this.totalPages = response.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading solde transfers:', error);
        this.soldeTransfers = [];
        this.loading = false;
      }
    });
  }

  loadTagTransfers(): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      type: 'tag'
    };
    
    if (this.filterDateFrom) params.dateFrom = this.filterDateFrom;
    if (this.filterDateTo) params.dateTo = this.filterDateTo;
    if (this.filterStatus) params.status = this.filterStatus;
    if (this.filterAccount) params.account = this.filterAccount;

    this.generalService.getTransfersPaginated(params).subscribe({
      next: (response) => {
        this.tagTransfers = response.data || [];
        this.totalItems = response.total || 0;
        this.totalPages = response.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tag transfers:', error);
        this.tagTransfers = [];
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    if (this.activeTab === 'solde') {
      this.loadSoldeTransfers();
    } else {
      this.loadTagTransfers();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getDisplayEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
}
