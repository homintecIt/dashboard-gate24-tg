import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/layouts/main/main.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ListeDesClientsComponent } from './components/liste-des-clients/liste-des-clients.component';
import { ListeDesComptesClientsComponent } from './components/liste-des-comptes-clients/liste-des-comptes-clients.component';
import { RechargesListComponent } from './components/recharges-list/recharges-list.component';
import { SubscribeListComponent } from './components/subscribe-list/subscribe-list.component';

const routes: Routes = [
  {
    path: "", component: MainComponent,
    children: [
      { path: "statistics", component: StatisticsComponent },
      { path: "statistics", component: StatisticsComponent },
      { path: "listesClients", component: ListeDesClientsComponent },
      { path: "listesComptesClient", component: ListeDesComptesClientsComponent },


      { path: "recharges-list", component: RechargesListComponent },
      { path: "subscribe-list", component: SubscribeListComponent },
      { path: "", redirectTo: "statistics", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
