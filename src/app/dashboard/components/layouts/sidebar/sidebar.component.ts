import { Component, OnInit } from '@angular/core';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { PassagesDropdownSiteComponent } from '../../passages/passages-dropdown-site/passages-dropdown-site.component';

import { MonthlyReportModalComponent } from '../../monthly-report/monthly-report-modal/monthly-report-modal.component';
import { PeriodReportModalComponent } from '../../period-report/period-report-modal/period-report-modal.component';
import { DateModalComponent } from '../../financial-data/date-modal/date-modal.component';
import { storageHelper } from 'src/app/misc/storage.misc';
import { MenuUserIdentifier, userIdentifier } from 'src/app/misc/utilities.misc';
import { User } from 'src/app/models/user.model';
interface Menu {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  titre: string;
  icon: string;
  link: string;
  frontend_icon: string | null;
  frontend_route: string | null;
}

interface MenuItem {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  menu: Menu;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuList: MenuItem[] = [];
  currentUser!: User | null;

  constructor(
    private modalService: BootstrapModalService,  ) {}
  ngOnInit(): void {
    this.menuList = storageHelper.local.get(`${MenuUserIdentifier}`);
        this.currentUser = storageHelper.local.get(`${userIdentifier}`);
  }


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


}
