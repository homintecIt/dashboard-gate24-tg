import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetRequestComponent } from './components/auth/password-reset-request/password-reset-request.component';
import { PasswordResetFormComponent } from './components/auth/password-reset-form/password-reset-form.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { DashGuard } from './guards/dashboard.guard';

const routes: Routes = [
  { path: "auth/signin", component: SignInComponent, canActivate: [AuthGuard] },
  { path: "auth/forgot-password", component: PasswordResetRequestComponent },
  { path: "auth/reset-password", component: PasswordResetFormComponent },
  {
    path: 'dashboard',
    canActivate: [DashGuard],
    canLoad: [DashGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: "not-found", component: NotFoundComponent },
  { path: "", redirectTo: "auth/signin", pathMatch: "full" },
  { path: "**", redirectTo: "not-found", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
