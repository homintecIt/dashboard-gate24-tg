// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface User {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  password?: string;
  api_token: string | null;
  remember_token: string | null;
  account_number: string | null;
  is_active: boolean;
  role: string;
}

export interface UserUpdateDto {
  id: number;
  name?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiTestUrl;

  // Gestion de l'état
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  users$ = this.usersSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chargement des utilisateurs
  loadUsers(): Observable<User[]> {
    this.loadingSubject.next(true);

    return this.http.get<User[]>(`${this.apiUrl}/users/get-users`).pipe(
      tap(users => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Erreur de chargement des utilisateurs', error);
        return throwError(() => error);
      }),
      shareReplay(1)
    );
  }

  // Mise à jour d'un utilisateur
  updateUser(updateDto: UserUpdateDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/update/user`, updateDto).pipe(
      tap(updatedUser => {
        // Mettre à jour l'utilisateur dans le BehaviorSubject
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        );
        this.usersSubject.next(updatedUsers);
      }),
      catchError(error => {
        console.error('Erreur de mise à jour de l\'utilisateur', error);
        return throwError(() => error);
      })
    );
  }



    // Activation ou desactivation d'un utilisateur
    updateStatusUser(updateDto: {user_id:number, status:number}){
      return this.http.post(`${this.apiUrl}/users/update/user/status`, updateDto).pipe(
        tap(reponse => {
          console.log("response",reponse);

        }),
        catchError(error => {
          console.error('Erreur de mise à jour de l\'utilisateur', error);
          console.log("serveur error",error);

          return throwError(() => error);
        })
      );
    }

  // Suppression d'un utilisateur (si l'API le permet)
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/delete/${userId}`).pipe(
      tap(() => {
        // Retirer l'utilisateur du BehaviorSubject
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.filter(user => user.id !== userId);
        this.usersSubject.next(updatedUsers);
      }),
      catchError(error => {
        console.error('Erreur de suppression de l\'utilisateur', error);
        return throwError(() => error);
      })
    );
  }
}
