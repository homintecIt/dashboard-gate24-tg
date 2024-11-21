// subscription-edit-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SubscriptionService } from '../../services/subscribe-list.service';

@Component({
  selector: 'app-subscription-edit-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Modifier l'abonnement</h4>
      <button type="button" class="btn-close" (click)="bsModalRef.hide()"></button>
    </div>
    <div class="modal-body">
      <div *ngIf="loading" class="text-center p-4">
        <div class="spinner-border text-primary"></div>
      </div>

      <form *ngIf="!loading" [formGroup]="editForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Nom</label>
            <input type="text" class="form-control" formControlName="nom">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Prénom</label>
            <input type="text" class="form-control" formControlName="prenom">
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Téléphone</label>
            <input type="number" class="form-control" formControlName="tel">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Code Client</label>
            <input type="text" class="form-control" formControlName="codeClient">
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">ID Badge</label>
            <input type="text" class="form-control" formControlName="idBadge">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Solde</label>
            <input type="text" class="form-control" formControlName="solde">
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">ID UHF</label>
            <input type="text" class="form-control" formControlName="iduhf">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Code UHF</label>
            <input type="text" class="form-control" formControlName="codeUhf">
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Plaque</label>
            <input type="text" class="form-control" formControlName="plaque">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">ID Utilisateur</label>
            <input type="number" class="form-control" formControlName="user_id">
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="bsModalRef.hide()">Annuler</button>
      <button type="button" class="btn btn-primary"
              (click)="onSubmit()"
              [disabled]="editForm.invalid || isSubmitting">
        <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
        Enregistrer
      </button>
    </div>
  `
})
export class SubscriptionEditModalComponent implements OnInit {
  editForm: FormGroup;
  data: any; // Pour recevoir l'ID depuis le modal service
  loading = false;
  isSubmitting = false;
  subscription: any;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService
  ) {
    this.editForm = this.fb.group({
      nom: [''],
      prenom: [''],
      tel: [null],
      idBadge: [''],
      codeClient: [''],
      solde: [''],
      iduhf: [''],
      codeUhf: [''],
      plaque: [''],
      user_id: [null]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.loading = true;
      // Ajoutez cette méthode dans votre SubscriptionService
      this.subscriptionService.getSubscriptionById(this.data).subscribe({
        next: (subscription) => {
          this.subscription = subscription;
          this.editForm.patchValue({
            nom: subscription.nom || '',
            prenom: subscription.prenom || '',
            tel: subscription.tel || null,
            idBadge: subscription.idBadge || '',
            codeClient: subscription.codeClient || '',
            solde: subscription.solde || '',
            iduhf: subscription.iduhf || '',
            codeUhf: subscription.codeUhf || '',
            plaque: subscription.plaque || '',
            user_id: subscription.user_id || null
          });
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

  onSubmit(): void {
    if (this.editForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const updateData = this.editForm.value;

      this.subscriptionService.updateSubscription(this.data, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.bsModalRef.hide();
          // Émettre un événement pour rafraîchir la liste
          this.subscriptionService.refreshSubscriptions().subscribe();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.isSubmitting = false;
          // Gérer l'erreur (afficher un message, etc.)
        }
      });
    }
  }
}
