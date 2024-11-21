import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/layouts/main/main.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { RechargesListComponent } from './components/recharges-list/recharges-list.component';
import { SubscribeListComponent } from './components/subscribe-list/subscribe-list.component';
import { PassageDailyComponent } from './components/passages/passages-daily/passages-daily.component';

const routes: Routes = [
  {
    path: "", component: MainComponent,
    children: [
      { path: "statistics", component: StatisticsComponent },
      { path: "recharges-list", component: RechargesListComponent },
      { path: "subscribe-list", component: SubscribeListComponent },
      { path: "passage-daily", component: PassageDailyComponent }, // Ajout de la route pour passage-daily
      { path: "", redirectTo: "statistics", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
