import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import apiEndpoints from 'src/app/misc/api-endpoints.misc';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  @Output() successEvent = new EventEmitter<any>();
  @Output() failureEvent = new EventEmitter<any>();

  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
    if (this.usersSubject.getValue().length === 0) {
      return this.httpClient.get<User[]>(`${apiEndpoints.userUrl}/list`).pipe(
        tap(users => this.usersSubject.next(users))
      );
    } else {
      return this.users$;
    }
  }

  getUser(id: any): Observable<User> {
    return this.httpClient.get<User>(`${apiEndpoints.userUrl}/${id}`);
  }

  saveUser(data: any): Observable<User> {
    return this.httpClient.post<User>(`${apiEndpoints.registerUrl}`, data).pipe(
      tap(() => this.clearUsersCache())
    );
  }

  updateUser(id: string, data: any): Observable<User> {
    return this.httpClient.patch<User>(`${apiEndpoints.userUrl}/update/profile/${id}`, data).pipe(
      tap(() => this.clearUsersCache())
    );
  }

  deleteUser(id: string): Observable<User> {
    return this.httpClient.delete<User>(`${apiEndpoints.userUrl}/delete/${id}`).pipe(
      tap(() => this.clearUsersCache())
    );
  }
  activateUserCompt(id: string): Observable<User> {
    return this.httpClient.get<User>(`${apiEndpoints.userUrl}/activate/${id}`).pipe(
      tap(() => this.clearUsersCache())
    );
  }
  deactivateUserCompt(id: string): Observable<User> {
    return this.httpClient.get<User>(`${apiEndpoints.userUrl}/deactivate/${id}`).pipe(
      tap(() => this.clearUsersCache())
    );
  }
  onSuccess(data: any) {
    this.successEvent.emit(data);
  }

  onFailure(data: any) {
    this.failureEvent.emit(data);
  }

  private clearUsersCache() {
    this.usersSubject.next([]);
  }
}
