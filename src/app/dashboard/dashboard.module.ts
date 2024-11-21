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
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule ,
    FormsModule,
  ],
  providers: [RechargesService, SubscriptionService]
})
export class DashboardModule { }
