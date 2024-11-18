// src/app/dashboard/components/recharges-list/recharges-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Recharge } from '../../interfaces/recharges';

@Component({
  selector: 'app-recharges-list',
  templateUrl: './recharges-list.component.html',
  styleUrls: ['./recharges-list.component.css']
})
export class RechargesListComponent implements OnInit {
  recharges: Recharge[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchRecharges();
  }

  fetchRecharges() {
    this.loading = true;
    const payload = {

    };

    this.apiService.post<any>('/recharges/all', payload)
      .subscribe({
        next: (response) => {
          this.recharges = response.items;
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.loading = false;
        }
      });
  }
}
