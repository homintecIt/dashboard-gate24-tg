import { Component } from '@angular/core';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { MonthlyReportModalComponent } from '../../monthly-report/monthly-report-modal/monthly-report-modal.component';
import { PeriodReportModalComponent } from '../../period-report/period-report-modal/period-report-modal.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(
    private modalService: BootstrapModalService

  ) {}
  

  openMonthlyReport() {
    this.modalService.openModal(MonthlyReportModalComponent,'modal-md modal-dialog-centered');
  }

  openPeriodReport() {
    this.modalService.openModal(PeriodReportModalComponent,'modal-md modal-dialog-centered');
  }


}
