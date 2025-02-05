// src/app/guards/menu-access.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { UserService } from '../dashboard/components/services/users-service.service';
import { storageHelper } from '../misc/storage.misc';
import { userIdentifier } from '../misc/utilities.misc';

@Injectable({
  providedIn: 'root'
})
export class MenuAccessGuard implements CanActivate {
  private userMenus: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    // Charger initialement les menus de l'utilisateur
    this.loadUserMenus();
  }

  private loadUserMenus(): void {
    // Récupérer l'ID de l'utilisateur connecté (à adapter selon votre logique d'authentification)
    const userId = this.getCurrentUserId();

    if (userId) {
      this.userService.getUserMenus(userId).subscribe({
        next: (menus) => {
          this.userMenus = menus;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des menus:', error);
          this.userMenus = [];
        }
      });
    }
  }

  private getCurrentUserId(): number | null {
    // À adapter selon votre logique de stockage de l'utilisateur connecté
    const userStr = storageHelper.local.get(`${userIdentifier}`);
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
    return null;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const userId = this.getCurrentUserId();

    if (!userId) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.userService.getUserMenus(userId).pipe(
      map(menus => {
        // Vérifier si l'URL actuelle correspond à une route autorisée
        const currentUrl = state.url;
        const hasAccess = menus.some(menuItem =>
          menuItem.menu.frontend_route === currentUrl ||
          currentUrl.startsWith(menuItem.menu.frontend_route)
        );

        if (!hasAccess) {
          console.warn(`Accès refusé à la route: ${currentUrl}`);
          this.router.navigate(['/dashboard']); // Rediriger vers une page par défaut
          return false;
        }

        return true;
      }),
      catchError(error => {
        console.error('Erreur lors de la vérification des droits:', error);
        this.router.navigate(['/dashboard']);
        return of(false);
      })
    );
  }
}
