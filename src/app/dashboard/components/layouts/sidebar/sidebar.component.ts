import { Component } from '@angular/core';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { PassagesDropdownSiteComponent } from '../../passages/passages-dropdown-site/passages-dropdown-site.component';

import { MonthlyReportModalComponent } from '../../monthly-report/monthly-report-modal/monthly-report-modal.component';
import { PeriodReportModalComponent } from '../../period-report/period-report-modal/period-report-modal.component';
import { DateModalComponent } from '../../financial-data/date-modal/date-modal.component';
import { RechercheModalComponent } from '../../enroulements/recherche-modal/recherche-modal.component';
import { SearchListComponent } from '../../enroulements/search-list/search-list.component';
import { PermissionService } from 'src/app/services/permission.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(
    private modalService: BootstrapModalService,
    public permissionService : PermissionService

  ) {}


    openPassagesModal(): void {
      this.modalService.openModal(PassagesDropdownSiteComponent,"",'modal-md modal-dialog-centered');
    }


  openMonthlyReport() {
    this.modalService.openModal(MonthlyReportModalComponent,'modal-md modal-dialog-centered');
  }

  openPeriodReport() {
    this.modalService.openModal(PeriodReportModalComponent,'modal-md modal-dialog-centered');
  }

  openFinancialData() {
    this.modalService.openModal(DateModalComponent,'modal-md modal-dialog-centered');
  }


    searchChoice() {
      this.modalService.openModal(SearchListComponent, '', 'modal-md modal-dialog-centered');
    }


     showCompte() {
    this.modalService.openModal(RechercheModalComponent, "accountNumber", 'modal-md modal-dialog-centered');

    }

     showTag() {
    this.modalService.openModal(RechercheModalComponent, "tagCode", 'modal-md modal-dialog-centered');

    }


      newCompte() {
    this.modalService.openModal(SearchListComponent, "newCompte", 'modal-md modal-dialog-centered');

    }

}
