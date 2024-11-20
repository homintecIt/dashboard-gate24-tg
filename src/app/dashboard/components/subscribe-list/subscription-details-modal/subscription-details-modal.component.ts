import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from '../../services/subscribe-list.service';


@Component({
  selector: 'app-subscription-details-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">Détails de l'abonnement</h4>
      <button type="button" class="btn-close close pull-right" aria-label="Close" (click)="modalRef.hide()">
        <span aria-hidden="true" class="visually-hidden">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
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
          <h5>Informations supplémentaires</h5>
          <table class="table table-bordered">
            <tbody>
              <tr *ngIf="subscription?.plaque">
                <th>Plaque</th>
                <td>{{ subscription?.plaque }}</td>
              </tr>
              <tr *ngIf="subscription?.nom">
                <th>Nom</th>
                <td>{{ subscription?.nom }}</td>
              </tr>
              <tr *ngIf="subscription?.prenom">
                <th>Prénom</th>
                <td>{{ subscription?.prenom }}</td>
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

  constructor(public modalRef: BsModalRef) {}

  ngOnInit(): void {
    // Utilisez `data` qui est passé via initialState dans le service modal
    if (this.data) {
      this.subscription = this.data;
      console.log('Détails de l\'abonnement:', this.subscription);
    }
  }
}
