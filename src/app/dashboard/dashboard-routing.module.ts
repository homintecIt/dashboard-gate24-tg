import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/layouts/main/main.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { RechargesListComponent } from './components/recharges-list/recharges-list.component';
import { SubscribeListComponent } from './components/subscribe-list/subscribe-list.component';
import { PassageDailyComponent } from './components/passages/passages-daily/passages-daily.component';
import { PassageBySubscriberComponent } from './components/passages/passage-by-subscriber/passage-by-subscriber.component';
import { ListeDesComptesClientsComponent } from './components/liste-des-comptes-clients/liste-des-comptes-clients.component';
import { MonthlyReportComponent } from './components/monthly-report/monthly-report.component';
import { PeriodReportComponent } from './components/period-report/period-report.component';
import { TypeSynchroComponent } from './components/type-synchro/type-synchro.component';
import { FinancialDataComponent } from './components/financial-data/financial-data.component';
import { ServersComponent } from './components/servers/servers.component';
import { UsersComponent } from './components/users/users.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { DetailCompteClientComponent } from './components/liste-des-comptes-clients/detail-compte-client/detail-compte-client.component';
import { SyncStatusComponent } from './components/sync-status/sync-status.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { ListeDesClientsComponent } from './components/clients/liste-des-clients/liste-des-clients.component';
import { EditClientModalComponent } from './components/clients/edit-client-modal/edit-client-modal.component';
import { SubscribeListCompteComponent } from './components/clients/subscribe-list-compte/subscribe-list-compte.component';
import { TransactionListSubscribeComponent } from './components/clients/transaction-list-subscribe/transaction-list-subscribe.component';
import { EnroulementComponent } from './components/enroulements/enroulement.component';
import { ShowCompteComponent } from './components/clients/show-compte/show-compte.component';
import { ShowtagComponent } from './components/clients/show-tag/show-tag.component';
import { MenusComponent } from './components/users/menus/menus.component';
import { RolesComponent } from './components/users/roles/roles.component';
import { PermissionGuard } from '../guards/permission.guard';
import { AddClientLitigeComponent } from './components/clients/litige/add-client-litige/add-client-litige.component';
import { ShowCompteLitigeComponent } from './components/clients/litige/show-compte-litige/show-compte-litige.component';
const routes: Routes = [
  {


    path: "", component: MainComponent,
    children: [
      { path: "statistics", component: StatisticsComponent,

       },
      { path: "enroulement", component: EnroulementComponent },
      { path: "recharges-list", component: RechargesListComponent ,
         canActivate: [PermissionGuard],
          data: { menu: 'Gestion utilisateurs' }
      },
      { path: "subscribe-list", component: SubscribeListComponent ,
         canActivate: [PermissionGuard],
          data: { menu: "Gestion abonnement" }
      },
      { path: "subscribe-list/compte/:accountNumber", component: SubscribeListCompteComponent,
         canActivate: [PermissionGuard],
          data: { menu: 'Gestion comptes' }
       },
      { path: "passage-daily", component: PassageDailyComponent },
      { path: "passage-by-subscriber", component: PassageBySubscriberComponent },
      { path: "listesClients", component: ListeDesClientsComponent ,
         canActivate: [PermissionGuard],
          data: { menu: 'Gestion clients' }
      },
      { path: "listesComptesClient", component: ListeDesComptesClientsComponent,
         canActivate: [PermissionGuard],
          data: { menu: 'Gestion clients' }
       },
      { path: "passage-monthly", component: MonthlyReportComponent },
      { path: "passage-period", component: PeriodReportComponent },
      { path: "settings/type-synchro", component: TypeSynchroComponent,
         canActivate: [PermissionGuard],
          data: { menu: 'Gestion utilisateurs' }
       },
      { path: 'financial-data', component: FinancialDataComponent },
      { path: "listeServer", component: ServersComponent ,
         canActivate: [PermissionGuard],
          data: { menu: 'Gestion utilisateurs' }
      },
      { path: "users", component: UsersComponent ,
          canActivate: [PermissionGuard],
          data: { menu: 'Gestion utilisateurs' }
      },
      { path: "transactions", component: TransactionsComponent,
         canActivate: [PermissionGuard],
          data: { menu: 'Transactions' }
       },
      { path: "transaction/byTag", component: TransactionListSubscribeComponent },
      { path: 'clients/details/:tel', component: EditClientModalComponent },
      { path: 'clients/details/litige/:tel', component: ShowCompteLitigeComponent },


      { path: 'add-client', component: AddClientComponent },
      { path: 'listesComptesClient/details/:accountNumber', component: DetailCompteClientComponent },
      { path: 'sync-status', component: SyncStatusComponent },
      { path: 'show-compte', component: ShowCompteComponent, },
      { path: 'show/tag', component: ShowtagComponent },
      { path: 'create/client/litige', component: AddClientLitigeComponent },
      { path: 'menus', component: MenusComponent ,
         canActivate: [PermissionGuard],
          data: { menu: 'Gestion utilisateurs' }
      },
      { path: 'roles', component: RolesComponent ,
         canActivate: [PermissionGuard],
          data: { menu: 'Gestion utilisateurs' }
      },








      { path: "", redirectTo: "statistics", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
