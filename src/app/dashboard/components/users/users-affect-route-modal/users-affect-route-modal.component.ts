import { Component, Input } from '@angular/core';
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


  routes = [
    { id: 1, name: 'Route A' },
    { id: 2, name: 'Route B' },
    { id: 3, name: 'Route C' },
    { id: 4, name: 'Route D' },
    { id: 5, name: 'Route E' }
  ];

  selectedRoutes: any[] = [];  // Pour stocker les routes sélectionnées

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: BootstrapModalService,
    public bsModalRef: BsModalRef,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.loading = true;
      // Ajoutez cette méthode dans votre SubscriptionService
      this.routingService.loadRoutes().subscribe({
        next: (routers) => {
          this.routers = routers;
          // this.editForm.patchValue({
          //   nom: routers.id || '',
          //   prenom: routers.created_at || '',
          //   tel: routers.updated_at || null,
          //   idBadge: routers.titre || '',
          //   codeClient: routers.icon || '',
          //   solde: routers.link || '',
          //   iduhf: routers.frontend_icon || '',
          //   codeUhf: routers.frontend_route || '',

          // });
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
    });
  }


}
