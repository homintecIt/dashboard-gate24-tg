import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})

class PermissionsService {

  constructor(
    private router: Router,
    private authService: AuthService
    ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): | boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log(this.authService.isAuthenticated);

    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl('/dashboard');
      return false;
    }
    return true;
  }


  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): | boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): | boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  return inject(PermissionsService).canActivate(next, state);
}


export const canActivateChild: CanActivateChildFn = ( next: ActivatedRouteSnapshot, state: RouterStateSnapshot ): | boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
    return inject(PermissionsService).canActivateChild(next, state);
};

