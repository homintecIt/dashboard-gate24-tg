// user.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User, UserService, UserUpdateDto } from '../services/users-service.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { UsersEditModalComponent } from './users-edit-modal/users-edit-modal.component';
import { UsersDeleteModalComponent } from './users-delete-modal/users-delete-modal.component';
import { swalAnimation } from 'src/app/misc/utilities.misc';
import Swal from 'sweetalert2';
import { UsersAffectRouteModalComponent } from './users-affect-route-modal/users-affect-route-modal.component';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Données
  users: User[] = [];
  filteredUsers: User[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Recherche
  searchTerm = '';

  // États
  loading = false;
  error: string | null = null;

  // Modaux et actions
  selectedUser?: User;

  constructor(private userService: UserService, private modalService: BootstrapModalService,) {}

  ngOnInit(): void {
    // Écoute des utilisateurs
    this.userService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = users;
        this.filterUsers();
      });

    // Écoute du chargement
    this.userService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    // Chargement initial
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des utilisateurs
  loadUsers(): void {
    this.error = null
    this.userService.loadUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les utilisateurs';
        }
      });
  }

  // Filtrage des utilisateurs
  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }

  // Recherche
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.filterUsers();
  }

  // Changement de statut
  onStatusToggle(user: User): void {


    swalWithBootstrapButtons.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment ${user.is_active ? 'désactiver' : 'activer'} l'utilisateur "${user.name}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      confirmButtonColor: ' #405189',
          cancelButtonColor: '#6c757d',
          allowOutsideClick: false,
          allowEscapeKey: false,
          reverseButtons: false,
          ...swalAnimation,
    }).then((result) => {
      if (result.isConfirmed) {
        const updateDto = {
          user_id: user.id,
          status: user.is_active ? 0 : 1
        };

        this.userService.updateStatusUser(updateDto).subscribe(
          () => {

            Swal.fire('Succès', `Le statut a été mis à jour.`, 'success');
            this.refreshData();
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du statut', error);
            Swal.fire('Erreur', 'La mise à jour a échoué.', 'error');
          }
        );
      }
    });



    // this.userService.updateStatusUser(updateDto)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     error: (err) => {
    //       console.error('Erreur de mise à jour du statut', err);
    //       // Optionnel : notification d'erreur
    //     }
    //   });
  }

  // Ouverture du modal d'édition
  openEditModal(user: User): void {
    this.selectedUser = user;
    this.modalService.openModal(UsersEditModalComponent,user , 'modal-lg',);

    this.modalService.modalRef.onHidden?.subscribe(() => {
      this.refreshData(); // Rafraîchir la liste après fermeture du modal
    });
  }

  // Sauvegarde des modifications
  onSaveChanges(changes: Partial<UserUpdateDto>): void {
    if (this.selectedUser) {
      const updateDto: UserUpdateDto = {
        id: this.selectedUser.id,
        ...changes
      };

      this.userService.updateUser(updateDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeModals();
          },
          error: (err) => {
            console.error('Erreur de mise à jour', err);
            // Optionnel : notification d'erreur
          }
        });
    }
  }

  // Ouverture du modal de confirmation de suppression
  openDeleteConfirmModal(user: User): void {
    this.selectedUser = user;
    this.modalService.openModal(UsersDeleteModalComponent,user , 'modal-lg',);

  }

  // Suppression de l'utilisateur
  confirmDelete(): void {
    if (this.selectedUser) {
      this.userService.deleteUser(this.selectedUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeModals();
          },
          error: (err) => {
            console.error('Erreur de suppression', err);
            // Optionnel : notification d'erreur
          }
        });
    }
  }



    // Ouverture du modal d'édition
    openAffectModal(user: User): void {
      this.selectedUser = user;
      this.modalService.openModal(UsersAffectRouteModalComponent,user , 'modal-lg',);

      this.modalService.modalRef.onHidden?.subscribe(() => {
        this.refreshData(); // Rafraîchir la liste après fermeture du modal
      });
    }

    openAffectModale(): void {

      this.modalService.openModal(UsersAffectRouteModalComponent , 'modal-lg',);

      this.modalService.modalRef.onHidden?.subscribe(() => {
        this.refreshData(); // Rafraîchir la liste après fermeture du modal
      });
    }

  // Fermeture des modaux
  closeModals(): void {
    this.selectedUser = undefined;
  }
  refreshData(): void {
    this.loadUsers();
  }
}
