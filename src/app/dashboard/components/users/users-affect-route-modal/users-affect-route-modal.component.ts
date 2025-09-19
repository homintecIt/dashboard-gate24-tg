import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { User, UserService } from '../../services/users-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-users-affect-route-modal',
  templateUrl: './users-affect-route-modal.component.html',
  styleUrls: ['./users-affect-route-modal.component.css']
})
export class UsersAffectRouteModalComponent {
  data: any;
  editForm!: FormGroup;
  loading = false;
  routers: any
  isSubmitting = false;

  // routes = [
  //   { id: 1, name: 'Route A' },
  //   { id: 2, name: 'Route B' },
  //   { id: 3, name: 'Route C' },
  //   { id: 4, name: 'Route D' },
  //   { id: 5, name: 'Route E' }
  // ];

  menuId: any[] = [];
  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private routingService: RoutingService,

  ) {}

  ngOnInit(): void {
    if (!this.menuId) {
      this.menuId = [];  // Assurez-vous que ce tableau n'est pas undefined.
    }
    if (this.data) {
      this.loading = true;
      // Ajoutez cette méthode dans votre SubscriptionService
      this.routingService.loadRoutes().subscribe({
        next: (routers) => {
          this.routers = routers;

          console.log(this.routers);

          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des données:', error);
          this.loading = false;
          // Gérer l'erreur (afficher un message, etc.)
        }
      });
    }
    this.editForm = this.fb.group({
      id: [this.data.id],
      menuId: [this.menuId || []]
    });
  }


  onSubmit(): void {

    console.log('Routes sélectionnées :', this.editForm);
    this.routingService.affectRoutes(this.editForm.value).subscribe({
      next: (routers) => {
        this.loading = false;
        this.bsModalRef.hide();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.loading = false;
        this.bsModalRef.hide();

        // Gérer l'erreur (afficher un message, etc.)
      }
    });
  }

  onRoutesChange(newRoutes: any[]): void {
    console.log(newRoutes);

    console.log('Nouvelles routes sélectionnées:', newRoutes); // Vérifie si cette fonction est appelée
    this.menuId = [...newRoutes];  // Copie les valeurs reçues
  }

}
