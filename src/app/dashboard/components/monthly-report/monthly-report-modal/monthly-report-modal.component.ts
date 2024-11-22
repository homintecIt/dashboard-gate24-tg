import { Router } from '@angular/router';
import { MonthlyReportService } from './../../services/monthly-report.service';
import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-monthly-report-modal',
  templateUrl: './monthly-report-modal.component.html',
  styleUrls: ['./monthly-report-modal.component.css']
})
export class MonthlyReportModalComponent {

  constructor(private MonthlyService:MonthlyReportService,
    public bsModalRef: BsModalRef,
    public router:Router,
  ){}


  @Input() data: any
  dropdownOptions: any[] = [];
  selectedOption: string = '';
  reports: any[] = [];

  ngOnInit(): void {
    this.loadDropdownOptions();
  }

  loadDropdownOptions() {
    this.MonthlyService.getDropdownOptions().subscribe((options) => {
      this.dropdownOptions = options;
      console.log(options)
    });


  }

  // Lorsqu'un site est sélectionné
  onSiteSelected(site: string): void {
    this.selectedOption = site;
    console.log(site)

    // Construire le payload
    const payload = {
      draw: 0,
      start: 0,
      length: 0,
      order: [''],
      columns: [''],
      search: {},
      dateStart: '',
      dateEnd: '',
      site: site, // Site sélectionné
      targCode: ''
    };
    console.log(site)


      this.router.navigate(['/dashboard/passage-monthly'], { queryParams: { site } });
      this.bsModalRef.hide(); // Fermer le modal

  }

}

