import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeriodReportService } from '../services/period-report.service';
@Component({
  selector: 'app-period-report',
  templateUrl: './period-report.component.html',
  styleUrls: ['./period-report.component.css']
})
export class PeriodReportComponent implements OnInit {

  site: string = '';
  records: any[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private passageService: PeriodReportService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.site = params['site'] || '';
      if (this.site) {
        this.fetchData();
      }
    });
  }

  fetchData(): void {
    const payload = {
      draw: 0,
      start: 0,
      length: 0,
      order: ['date'],
      columns: ['date', 'passages', 'total'],
      search: {},
      dateStart: '2024-01-01',
      dateEnd: '2024-12-31',
      site: this.site,
      targCode: ''
    };

    this.loading = true;
    this.passageService.getReports(payload).subscribe({
      next: (response) => {
        this.records = response.records || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données', err);
        this.loading = false;
      }
    });
  }


}