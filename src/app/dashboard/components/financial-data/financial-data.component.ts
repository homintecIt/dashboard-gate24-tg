import { Component, OnInit } from '@angular/core';
import { FinancialDataService } from '../services/financial-data.service';

@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
  styleUrls: ['./financial-data.component.css']
})
export class FinancialDataComponent implements OnInit {
  financialData: any[] = [];
  loading: boolean = false;

  constructor(private financialDataService: FinancialDataService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const requestBody = {
      draw: 1,
      columns: [],
      order: [{ column: 0, dir: 'asc' }],
      start: 3,
      length: 10,
      search: { value: '', regex: false },
      date: '2020-10-23',
      targCode: '',
    };

    this.loading = true;
    this.financialDataService.getFinancialData(requestBody).subscribe({
      next: (response) => {
        this.financialData = response.data; // Adapté à la structure de ma réponse apres avoir eu l'url
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données :', error);
        this.loading = false;
      },
    });
  }

}
