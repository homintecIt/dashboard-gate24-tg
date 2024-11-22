import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { PeriodReportService } from '../../services/period-report.service';

@Component({
  selector: 'app-period-report-modal',
  templateUrl: './period-report-modal.component.html',
  styleUrls: ['./period-report-modal.component.css']
})
export class PeriodReportModalComponent {

  constructor(private PeriodService:PeriodReportService,
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
    this.PeriodService.getDropdownOptions().subscribe((options) => {
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

      this.router.navigate(['/dashboard/passage-period'], { queryParams: { site } });
      this.bsModalRef.hide(); // Fermer le modal
  }

}
