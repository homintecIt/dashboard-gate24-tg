import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import localeFr from '@angular/common/locales/fr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PasswordResetFormComponent } from './components/auth/password-reset-form/password-reset-form.component';
import { PasswordResetRequestComponent } from './components/auth/password-reset-request/password-reset-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { registerLocaleData } from '@angular/common';
import { RequestInterceptor } from './misc/request-interceptor.misc';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { EditClientModalComponent } from './dashboard/components/liste-des-clients/edit-client-modal/edit-client-modal.component';
import { MonthlyReportModalComponent } from './dashboard/components/monthly-report/monthly-report-modal/monthly-report-modal.component';
import { PeriodReportModalComponent } from './dashboard/components/period-report/period-report-modal/period-report-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    PasswordResetFormComponent,
    PasswordResetRequestComponent,
    SignInComponent,
    EditClientModalComponent,
    MonthlyReportModalComponent,
    PeriodReportModalComponent
  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    ModalModule.forRoot(),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "fr-FR", },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
