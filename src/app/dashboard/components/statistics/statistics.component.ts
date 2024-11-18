import { Component, OnInit } from '@angular/core';
import { Statistic } from 'src/app/models/statistic.model';
import { StatisticService } from '../services/statistic.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  statistics!: Statistic;
  constructor(
    private statisticService: StatisticService
  ) { }

  ngOnInit(): void {
    this.getStatitics();
  }

  getStatitics() {
    this.statisticService.getStatistics().subscribe({
      next: (data: any) => {
        this.statistics = data;
      }
    })
  }
}
