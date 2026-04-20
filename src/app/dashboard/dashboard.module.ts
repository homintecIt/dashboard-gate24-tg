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
import { ListeDesClientsComponent } from './components/clients/liste-des-clients/liste-des-clients.component';
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
import { MultiSelectModule } from '../components/generic-multi-select/generic-multi-select.module';
import { ServersCreateModalComponent } from './components/servers/servers-create-modal/servers-create-modal.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ServerEditModalComponent } from './components/servers/server-edit-modal/server-edit-modal.component';
import { DetailCompteClientComponent } from './components/liste-des-comptes-clients/detail-compte-client/detail-compte-client.component';
import { TypeSynchroEditComponent } from './components/type-synchro/type-synchro-edit/type-synchro-edit.component';
import { CronSelectComponent } from './components/type-synchro/cron-select/cron-select.component';
import { CronTranslatorPipe } from './pipes/cron-translator.pipe';
import { SyncStatusComponent } from './components/sync-status/sync-status.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { SaveTagComponent } from './components/clients/save-tag/save-tag.component';
import { TransfertTagComponent } from './components/clients/transfert-tag/transfert-tag.component';
import { TransfertSoldeComponent } from './components/clients/transfert-solde/transfert-solde.component';
import { SaveCompteComponent } from './components/clients/save-compte/save-compte.component';
import { AddTagCompteComponent } from './components/clients/add-tag-compte/add-tag-compte.component';
import { AddRechargesComponent } from './components/clients/add-recharges/add-recharges.component';
import { SubscribeListCompteComponent } from './components/clients/subscribe-list-compte/subscribe-list-compte.component';
import { TransactionListSubscribeComponent } from './components/clients/transaction-list-subscribe/transaction-list-subscribe.component';
import { EnroulementComponent } from './components/enroulements/enroulement.component';
import { RechercheModalComponent } from './components/enroulements/recherche-modal/recherche-modal.component';
import { SearchListComponent } from './components/enroulements/search-list/search-list.component';
import { ShowCompteComponent } from './components/clients/show-compte/show-compte.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { ShowtagComponent } from './components/clients/show-tag/show-tag.component';
import { SaveTagWithouAmountComponent } from './components/clients/save-tag-without-amount/save-tag-without-amount.component';
import { UsersCreateModalComponent } from './components/users/users-create-modal/users-create-modal.component';
import { MenusComponent } from './components/users/menus/menus.component';
import { RolesComponent } from './components/users/roles/roles.component';
import { RolesService } from '../services/roles.service';
import { MenusService } from '../services/menus.service';
import { ChangePasswordComponent } from '../components/auth/change-password/change-password.component';
import { AddClientLitigeComponent } from './components/clients/litige/add-client-litige/add-client-litige.component';
import { ShowCompteLitigeComponent } from './components/clients/litige/show-compte-litige/show-compte-litige.component';
import { TransfertCompteComponent } from './components/clients/litige/transfert-compte/transfert-compte.component';
import { EditTagComponent } from './components/clients/edit-tag/edit-tag.component';
import { TransfertHistoryComponent } from './components/transfert-history/transfert-history.component';


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
    ServersCreateModalComponent,
    TransactionsComponent,
    ServerEditModalComponent,
    DetailCompteClientComponent,
    TypeSynchroEditComponent,
    CronSelectComponent,
    CronTranslatorPipe,
    SyncStatusComponent,
    AddClientComponent,
    SaveTagComponent,
    TransfertTagComponent,
    TransfertSoldeComponent,
    SaveCompteComponent,
    AddTagCompteComponent,
    AddRechargesComponent,
    SubscribeListCompteComponent,
    TransactionListSubscribeComponent,
    EnroulementComponent,
    RechercheModalComponent,
    SearchListComponent,
    ShowCompteComponent,
    EditClientComponent,
    ShowtagComponent,
    SaveTagWithouAmountComponent,
    UsersCreateModalComponent,
    MenusComponent,
    RolesComponent,
    ChangePasswordComponent,
    AddClientLitigeComponent,
    ShowCompteLitigeComponent,
    TransfertCompteComponent,
    EditTagComponent,
    TransfertHistoryComponent
     ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule ,
    FormsModule,
    MultiSelectModule
  ],
  providers: [RechargesService, SubscriptionService,RolesService,MenusService]
})
export class DashboardModule { }
