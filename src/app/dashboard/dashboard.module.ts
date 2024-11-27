import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Ajoutez cette importation

import { DashboardRoutingModule } from './dashboard-routing.module';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';
import { MainComponent } from './components/layouts/main/main.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { RechargesListComponent } from './components/recharges-list/recharges-list.component';
import { SubscribeListComponent } from './components/subscribe-list/subscribe-list.component';
import { RechargesService } from './components/services/recharges.service';
import { SubscriptionService } from './components/services/subscribe-list.service';
import { SubscriptionEditModalComponent } from './components/subscribe-list/subscription-edit-modal/subscription-edit-modal.component';
import { SubscriptionStatusSwitchComponent } from './components/subscribe-list/subscription-status-switch/subscription-status-switch.component';
import { SubscriptionDetailsModalComponent } from './components/subscribe-list/subscription-details-modal/subscription-details-modal.component';
import { PassagesDropdownSiteComponent } from './components/passages/passages-dropdown-site/passages-dropdown-site.component';
import { PassagesComponent } from './components/passages/passages.component';
import { PassageDailyComponent } from './components/passages/passages-daily/passages-daily.component';
import { PassageBySubscriberComponent } from './components/passages/passage-by-subscriber/passage-by-subscriber.component';
import { ListeDesClientsComponent } from './components/liste-des-clients/liste-des-clients.component';
import { ListeDesComptesClientsComponent } from './components/liste-des-comptes-clients/liste-des-comptes-clients.component';
import { MonthlyReportComponent } from './components/monthly-report/monthly-report.component';
import { PeriodReportComponent } from './components/period-report/period-report.component';
import { TypeSynchroComponent } from './components/type-synchro/type-synchro.component';
import { DateModalComponent } from './components/financial-data/date-modal/date-modal.component';
import { FinancialDataComponent } from './components/financial-data/financial-data.component';
import { ServersComponent } from './components/servers/servers.component';
import { UsersComponent } from './components/users/users.component';
import { UsersEditModalComponent } from './components/users/users-edit-modal/users-edit-modal.component';
import { UsersDeleteModalComponent } from './components/users/users-delete-modal/users-delete-modal.component';
import { UsersAffectRouteModalComponent } from './components/users/users-affect-route-modal/users-affect-route-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    StatisticsComponent,
    RechargesListComponent,
    SubscribeListComponent,
    SubscriptionEditModalComponent,
    SubscriptionStatusSwitchComponent,
    SubscriptionDetailsModalComponent,
    PassagesDropdownSiteComponent,
    PassagesComponent,
    PassageDailyComponent,
    PassageBySubscriberComponent,
    ListeDesClientsComponent,
    ListeDesComptesClientsComponent,
    MonthlyReportComponent,
    PeriodReportComponent,
    FinancialDataComponent,
    TypeSynchroComponent,
    DateModalComponent,
    ServersComponent,
    UsersComponent,
    UsersEditModalComponent,
    UsersDeleteModalComponent,
    UsersAffectRouteModalComponent,

     ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule ,
    FormsModule,
    NgSelectModule
  ],
  providers: [RechargesService, SubscriptionService]
})
export class DashboardModule { }
