// src/app/dashboard/components/subscribe-list/subscribe-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Subscription, SubscriptionResponse } from '../../interfaces/subscription';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-subscribe-list',
  templateUrl: './subscribe-list.component.html',
  styleUrls: ['./subscribe-list.component.css']
})
export class SubscribeListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  loading = false;
  error: string | null = null;

  // Paramètres de pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Paramètres de recherche
  searchTerm = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchSubscriptions();
  }

  fetchSubscriptions() {
    this.loading = true;

    const payload = {
      draw: this.currentPage,
      start: (this.currentPage - 1) * this.itemsPerPage,
      length: this.itemsPerPage,
      search: {
        value: this.searchTerm,
        regex: false
      },
      order: [{ column: 0, dir: 'desc' }],
      columns: [
        { data: 'targCode', searchable: true, orderable: true },
        { data: 'typeTarg', searchable: true, orderable: true },
        { data: 'statutTarg', searchable: true, orderable: true }
      ]
    };

    this.apiService.post<SubscriptionResponse>('/subscription/all', payload)
      .subscribe({
        next: (response) => {
          this.subscriptions = response.items;
          this.totalItems = response.meta.totalItems;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les abonnements';
          this.loading = false;
        }
      });
  }

  // Méthode de recherche
  onSearch() {
    this.currentPage = 1; // Réinitialiser à la première page
    this.fetchSubscriptions();
  }

  // Méthode de pagination
  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchSubscriptions();
  }
}
