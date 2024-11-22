import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';
import { MainComponent } from './components/layouts/main/main.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ListeDesClientsComponent } from './components/liste-des-clients/liste-des-clients.component';
import { ListeDesComptesClientsComponent } from './components/liste-des-comptes-clients/liste-des-comptes-clients.component';
import { MonthlyReportComponent } from './components/monthly-report/monthly-report.component';
import { PeriodReportComponent } from './components/period-report/period-report.component';




@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    StatisticsComponent,
    ListeDesClientsComponent,
    ListeDesComptesClientsComponent,
    MonthlyReportComponent,
    PeriodReportComponent,
     ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
