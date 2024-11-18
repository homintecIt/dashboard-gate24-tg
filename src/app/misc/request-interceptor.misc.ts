import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  finalize,
  Observable,
  of,
  share,
  switchMap,
  throwError,
} from 'rxjs';
import apiEndpoints from './api-endpoints.misc';
import { headers } from './headers.misc';
import { Router } from '@angular/router';
import { storageHelper } from './storage.misc';
import { SweetAlertService } from '../services/sweetalert.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private excludedUrls: string[];
  private filesUrls: string[];
  totalRequests = 0;
  requestsCompleted = 0;

  constructor(
    private authService: AuthService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.excludedUrls = [
      apiEndpoints.signinUrl,
      apiEndpoints.signupUrl,
      apiEndpoints.registerUrl,
      apiEndpoints.forgotPasswordUrl,
      apiEndpoints.resetPasswordUrl,
    ];

    this.filesUrls = [
      apiEndpoints.uploadProfileUrl
    ];
  }

  notifyRequestSuccess(request: HttpRequest<any>) {
    if (this.excludedUrls.includes(request.url) || request.method === 'GET')
      return;
    return;
  }

  notifyRequestFailure(request: HttpRequest<any>) {
    if (this.excludedUrls.includes(request.url) || request.method === 'GET')
      return;
    return;
  }

  notifyAuthSuccess(authRequest: HttpRequest<any>, successData: any) {
    if (authRequest.url !== apiEndpoints.signinUrl) return;
    this.authService.onAuthSuccess(successData);
    return;
  }

  notifyAuthFailure(authRequest: HttpRequest<any>, errorData: any) {
    if (authRequest.url !== apiEndpoints.signinUrl) return;
    this.authService.onAuthFailure(errorData);
    return;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.totalRequests = this.isValidUrlForInterceptor(request.url)
      ? this.totalRequests + 1
      : this.totalRequests;
    let clonedRequest: any;

    if (this.filesUrls.includes(request.url) || request.headers.get("bodyType") == "form-data" ) {
      clonedRequest = request.clone({ headers: headers.file().headers });
    } else if (this.isValidUrlForInterceptor(request.url)) {
      // console.log("interceptor", this.authService.isAuthenticated);
      if (!this.authService.isAuthenticated && this.authService.accessToken) {
        this.sweetAlertService.toastWarning(
          'Session expirée !',
          3000,
          'Veuillez vous connecter à nouveau'
        );
        storageHelper.local.clear();
        this.router.navigateByUrl(`/auth/signin`);
      }
      clonedRequest = request.clone({
        headers: headers.authenticated().headers,
      });
    } else if (!this.isValidUrlForInterceptor(request.url)) {
      clonedRequest = request.clone({ headers: headers.bare().headers });
    } else {
      clonedRequest = request.clone({ headers: headers.bare().headers });
    }

    return next.handle(clonedRequest).pipe(
      switchMap((data) => {
        if (!(data instanceof HttpErrorResponse) && !data.type) {
          return of(data);
        }
        return of(data);
      }),
      catchError((error: HttpErrorResponse) => {
        // // console.log(error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.requestsCompleted++;
        if (this.requestsCompleted === this.totalRequests) {
          this.totalRequests = 0;
          this.requestsCompleted = 0;
          return;
        }
      }),
      share()
    );
  }

  private isValidUrlForInterceptor(url: string) {
    if (this.excludedUrls.includes(url)) {
      return false;
    }
    return true;
  }
}
