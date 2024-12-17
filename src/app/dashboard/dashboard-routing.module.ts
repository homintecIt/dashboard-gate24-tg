import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/layouts/main/main.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { RechargesListComponent } from './components/recharges-list/recharges-list.component';
import { SubscribeListComponent } from './components/subscribe-list/subscribe-list.component';
import { PassageDailyComponent } from './components/passages/passages-daily/passages-daily.component';
import { PassageBySubscriberComponent } from './components/passages/passage-by-subscriber/passage-by-subscriber.component';
import { ListeDesClientsComponent } from './components/liste-des-clients/liste-des-clients.component';
import { ListeDesComptesClientsComponent } from './components/liste-des-comptes-clients/liste-des-comptes-clients.component';
import { MonthlyReportComponent } from './components/monthly-report/monthly-report.component';
import { PeriodReportComponent } from './components/period-report/period-report.component';
import { TypeSynchroComponent } from './components/type-synchro/type-synchro.component';
import { FinancialDataComponent } from './components/financial-data/financial-data.component';
import { ServersComponent } from './components/servers/servers.component';
import { UsersComponent } from './components/users/users.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { EditClientModalComponent } from './components/liste-des-clients/edit-client-modal/edit-client-modal.component';
const routes: Routes = [
  {
    path: "", component: MainComponent,
    children: [
      { path: "statistics", component: StatisticsComponent },
      { path: "recharges-list", component: RechargesListComponent },
      { path: "subscribe-list", component: SubscribeListComponent },
      { path: "passage-daily", component: PassageDailyComponent },
      { path: "passage-by-subscriber", component: PassageBySubscriberComponent },
      { path: "listesClients", component: ListeDesClientsComponent },
      { path: "listesComptesClient", component: ListeDesComptesClientsComponent },
      { path: "passage-monthly", component: MonthlyReportComponent },
      { path: "passage-period", component: PeriodReportComponent },
      { path: "settings/type-synchro", component: TypeSynchroComponent },
      { path: 'financial-data', component: FinancialDataComponent },
      { path: "listeServer", component: ServersComponent },
      { path: "users", component: UsersComponent },
      { path: "transactions", component: TransactionsComponent },
      { path: 'clients/details/:tel', component: EditClientModalComponent },


      { path: "", redirectTo: "statistics", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
