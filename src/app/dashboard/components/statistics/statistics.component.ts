import { Component, OnInit } from '@angular/core';
import { Statistic } from 'src/app/models/statistic.model';
import { StatisticService } from '../services/statistic.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  d = new Date();
  year = this.d.getFullYear();
  statistics!: Statistic;
  loading = false;
  error: string | null = null;
  constructor(private statisticService: StatisticService) {}

  ngOnInit(): void {

    this.getStatitics(this.year);
  }

  getStatitics(yearParam: number) {
    this.statisticService.getStatistics(yearParam).subscribe({
      next: (data: any) => {
        this.statistics = data;
      },
    });
  }

  onSearch(event: any): void {

    if (event.target.value.length == 4) {
      this.loading = true;
      this.year = event.target.value;
      this.statisticService.getStatisticByYear(this.year).subscribe({
        next: (data: any) => {
          this.statistics = data;
          this.error = null
          this.loading = false;
        },
        error: (err) => {
          this.loading = !this.loading;
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les données. verifiez l\'année';
        },
      });
    }
  }

  // onSearch(yearCible:number){
  //   if (yearCible === this.year) return;
  //   this.year = yearCible
  //   this.getStatitics(this.year)
  // }
}
