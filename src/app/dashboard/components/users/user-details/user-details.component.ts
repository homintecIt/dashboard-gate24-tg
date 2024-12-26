// user-details.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User, UserService } from '../../services/users-service.service';

interface Menu {
  id: number;
  titre: string;
  icon: string;
  link: string;
  modal: string;
  frontend_icon: string;
  frontend_route: string;
  created_at: string;
  updated_at: string;
}

interface UserMenu {
  id: number;
  created_at: string;
  updated_at: string;
  menu: Menu;
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  userId: number = 0;
  user?: User;
  allMenus: Menu[] = [];
  userMenus: UserMenu[] = [];
  loading = false;
  error: string | null = null;
  private activeMenuIds: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}


  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUserData();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      user: this.userService.getUserById(this.userId),
      userMenus: this.userService.getUserMenus(this.userId),
      allMenus: this.userService.getAllMenus()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.user = data.user;
        this.userMenus = data.userMenus;
        this.allMenus = data.allMenus;

        // Initialiser les menus actifs
        this.activeMenuIds = new Set(
          this.userMenus.map(userMenu => userMenu.menu.id.toString())
        );

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement', err);
        this.error = 'Impossible de charger les données';
        this.loading = false;
      }
    });
  }

  isMenuActive(menuId: number): boolean {
    return this.activeMenuIds.has(menuId.toString());
  }

  onMenuToggle(menu: Menu, event: any): void {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.activeMenuIds.add(menu.id.toString());
    } else {
      this.activeMenuIds.delete(menu.id.toString());
    }

    // Convertir le Set en array pour l'envoi
    const activeMenuIds = Array.from(this.activeMenuIds);

    this.userService.addUserMenus(this.userId, activeMenuIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Succès',
            text: 'Les accès ont été mis à jour avec succès',
            icon: 'success',
            confirmButtonColor: '#405189'
          });
        },
        error: (err) => {
          console.error('Erreur de mise à jour', err);
          // Annuler le changement en cas d'erreur
          if (isChecked) {
            this.activeMenuIds.delete(menu.id.toString());
          } else {
            this.activeMenuIds.add(menu.id.toString());
          }
          event.target.checked = !isChecked;

          Swal.fire({
            title: 'Erreur',
            text: 'La mise à jour des accès a échoué',
            icon: 'error',
            confirmButtonColor: '#405189'
          });
        }
      });
  }
}
