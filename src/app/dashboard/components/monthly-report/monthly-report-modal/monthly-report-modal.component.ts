import { Router } from '@angular/router';
import { MonthlyReportService } from './../../services/monthly-report.service';
import { MonthlyReport } from './../../../../models/monthlyReport.model';
import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
@Component({
  selector: 'app-monthly-report-modal',
  templateUrl: './monthly-report-modal.component.html',
  styleUrls: ['./monthly-report-modal.component.css']
})
export class MonthlyReportModalComponent {

  constructor(private MonthlyService:MonthlyReportService,
    public bsModalRef: BsModalRef,
    public router:Router,
    private modalService: BootstrapModalService
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
    // Naviguer vers la page avec les données
    this.router.navigate(['/dashboard/passage-monthly'], { queryParams: { site } });

    // Fermer le modal
    this.modalService.modalRef.hide(); // Ferme le modal via ngx-bootstrap
  }



}

