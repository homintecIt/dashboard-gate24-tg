import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl } from '@angular/forms';
import { FinancialService } from '../services/financial.service';
import { DateModalComponent } from './date-modal/date-modal.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
  styleUrls: ['./financial-data.component.css']
})
export class FinancialDataComponent implements OnInit {
  financialData: any[] = [];
  searchControl = new FormControl('');
  data: any[] = [];
  selectedDate: string = '';
  loading = false;
  searchTerm = '';
  error: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private financialService: FinancialService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedDate = params['date'] || '';
      if (this.selectedDate) {
        const payload = {
          "draw": 1,
          "columns": [],
          "order": [
              {
                  "column": 0,
                  "dir": "asc"
              }
          ],
          "start": 3,
          "length": 10,
          "search": {
              "value": "",
              "regex": false
          },
          "date":this.selectedDate,
          "targCode": ""
      };
        this.fetchFinancialData(payload);
      }
    });
  }

  fetchFinancialData(payload:any): void {
    this.financialData=[]
    this.loading = true;
    this.financialService.getFinancialData(payload).subscribe({
      next: (response) => {

        this.financialData = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données', error);
        this.loading = false;

        this.error="Erreur lors du chargement des données"
      }
    });
  }

  // Filtrer par targCode
  onSearch(event: any): void {

      this.searchTerm = event.target.value;
      const payload = {
        "draw": 1,
        "columns": [],
        "order": [
            {
                "column": 0,
                "dir": "asc"
            }
        ],
        "start": 3,
        "length": 10,
        "search": {
            "value": this.searchTerm,
            "regex": false
        },
        "date":this.selectedDate,
        "targCode": ""
    };
      this.fetchFinancialData(payload);

  }


}
