import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, SubscriptionService } from '../../services/subscribe-list.service';


@Component({
  selector: 'app-subscription-details-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">Détails d'un tag</h4>
      <button type="button" class="btn-close close pull-right" aria-label="Close" (click)="modalRef.hide()">
        <span aria-hidden="true" class="visually-hidden">&times;</span>
      </button>
    </div>
    <div *ngIf="loading" class="text-center p-4">
    <div class="spinner-border text-primary"></div>
  </div>
    <div class="modal-body">
      <div class="row" *ngIf="!loading">
        <div class="col-md-6">
          <div class="mb-3">
            <strong>Code Targ:</strong>
            <p>{{ subscription?.targCode }}</p>
          </div>
          <div class="mb-3">
            <strong>Type Targ:</strong>
            <span class="badge"
              [ngClass]="{
                'bg-success-subtle text-success': subscription?.typeTarg === 'CARTE',
                'bg-info-subtle text-info': subscription?.typeTarg !== 'CARTE'
              }">
              {{ subscription?.typeTarg }}
            </span>
          </div>
          <div class="mb-3">
            <strong>Statut:</strong>
            <span class="badge"
              [ngClass]="{
                'bg-success-subtle text-success': subscription?.statutTarg === 'actived',
                'bg-danger-subtle text-danger': subscription?.statutTarg !== 'actived'
              }">
              {{ subscription?.statutTarg === 'actived' ? 'Activé' : 'Désactivé' }}
            </span>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <strong>Numéro de compte:</strong>
            <p>{{ subscription?.compte?.accountNumber }}</p>
          </div>
          <div class="mb-3">
            <strong>Solde:</strong>
            <p>{{ subscription?.compte?.solde | currency:'XOF' }}</p>
          </div>
          <div class="mb-3">
            <strong>Date de création:</strong>
            <p>{{ subscription?.created_at | date:'medium' }}</p>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12">
          <h5>Informations supplémentaires (client et compte associé)</h5>
          <table class="table table-bordered">
            <tbody *ngIf="subscription?.client">
              <tr >
                <th>Numero de compte </th>
                <td>{{ subscription?.compte?.accountNumber }}</td>
              </tr>
              <tr >
                <th>Nom client</th>
                <td>{{ subscription?.client?.nom }}</td>
              </tr>
              <tr >
                <th>Prénom client</th>
                <td>{{ subscription?.client?.prenom }}</td>
              </tr>
              <tr >
                <th>Type de client</th>
                <td>{{ subscription?.client?.typeClient }}</td>
              </tr>
              <tr >
                <th>Adresse client</th>
                <td>{{ subscription?.client?.adresse }}</td>
              </tr>
              <tr >
                <th>Telephone client</th>
                <td>{{ subscription?.client?.tel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="modalRef.hide()">Fermer</button>
    </div>
  `
})
export class SubscriptionDetailsModalComponent implements OnInit {
  subscription?: Subscription;
  data: any;
 // États
 loading = false;
 error: string | null = null;
  constructor(public modalRef: BsModalRef,
    private subscrptionService: SubscriptionService,

  ) {}

  ngOnInit(): void {
    // Utilisez `data` qui est passé via initialState dans le service modal
    if (this.data) {
      this.loading = true;
      // Ajoutez cette méthode dans votre SubscriptionService
      this.subscrptionService.getSubscriptionByTagCode(this.data.targCode).subscribe({
        next: (subscription) => {
          this.subscription = subscription;

          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des données:', error);
          this.loading = false;
          // Gérer l'erreur (afficher un message, etc.)
        }
      });
    }
}
}
