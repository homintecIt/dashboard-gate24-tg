import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtTokenIdentifier } from 'src/app/misc/utilities.misc';
import { storageHelper } from 'src/app/misc/storage.misc';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUser$: BehaviorSubject<any>;

  @Output() authSuccessEvent = new EventEmitter<any>();
  @Output() registerSuccessEvent = new EventEmitter<any>();
  @Output() logoutSuccessEvent = new EventEmitter<any>();
  @Output() authFailureEvent = new EventEmitter<any>();
  constructor(
    private httpClient: HttpClient,
    public jwtHelper: JwtHelperService
  ) {
    this.authUser$ = new BehaviorSubject<any>({});
  }

  login(username: string, password: string) {
    let payload = JSON.stringify({
      email: username,
      password: password,
    });
    return this.httpClient.post<any>(apiEndpoints.signinUrl, payload);
  }

  register(data: any) {
    return this.httpClient.post<any>(apiEndpoints.registerUrl, data);
  }

  forgotPassword(data: any) {
    return this.httpClient.post<any>(apiEndpoints.forgotPasswordUrl, data);
  }

  resetPassword(data: any) {
    return this.httpClient.post<any>(apiEndpoints.resetPasswordUrl, data);
  }

  changePassword(data: any) {
    return this.httpClient.post<any>(apiEndpoints.changePasswordUrl, data);
  }

  get accessToken() {
    const token = storageHelper.local.get(`${jwtTokenIdentifier}`);
    return token;
  }

  get isAuthenticated() {
    const token = this.accessToken;
    // console.log('isTokenExpired',this.jwtHelper.isTokenExpired(token));
    const isAuthenticated = token && !this.jwtHelper.isTokenExpired(token);
    return isAuthenticated;
  }

  get user() {
    const token = storageHelper.local.get(`${jwtTokenIdentifier}`);
    const userData = jwtDecode(token);
    return userData;
  }

  get userRole() {
    const user: any = this.user;
    return user.role as string;
  }

  setAuthUser(authUser: any) {
    this.authUser$.next(authUser);
  }

  onAuthSuccess(data: any) {
    this.authSuccessEvent.emit(data);
  }

  onRegisterSuccess(data: any) {
    this.registerSuccessEvent.emit(data);
  }

  onLogoutSuccess(data: any) {
    this.logoutSuccessEvent.emit(data);
  }

  onAuthFailure(data: any) {
    this.authFailureEvent.emit(data);
  }
}
