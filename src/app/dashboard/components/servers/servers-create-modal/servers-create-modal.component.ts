// src/app/dashboard/components/serveur-modal/serveur-modal.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerService } from '../../services/servers.service';

@Component({
  selector: 'app-serveur-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Ajouter un Serveur</h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <form [formGroup]="serveurForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label class="form-label">Site</label>
          <input
            type="text"
            class="form-control"
            formControlName="site"
            placeholder="Nom du site"
          >
          <div
            *ngIf="serveurForm.get('site')?.invalid && (serveurForm.get('site')?.dirty || serveurForm.get('site')?.touched)"
            class="text-danger"
          >
            Le site est requis
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">URL</label>
          <input
            type="text"
            class="form-control"
            formControlName="url"
            placeholder="URL du serveur"
          >
          <div
            *ngIf="serveurForm.get('url')?.invalid && (serveurForm.get('url')?.dirty || serveurForm.get('url')?.touched)"
            class="text-danger"
          >
            L'URL est requise
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">État</label>
          <select
            class="form-select"
            formControlName="etat"
          >
            <option value="">Sélectionnez un état</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="en_panne">En panne</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <div
            *ngIf="serveurForm.get('etat')?.invalid && (serveurForm.get('etat')?.dirty || serveurForm.get('etat')?.touched)"
            class="text-danger"
          > 
            L'état est requis
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            (click)="activeModal.dismiss()"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="serveurForm.invalid"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class ServersCreateModalComponent {
  serveurForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private serverService: ServerService
  ) {
    this.serveurForm = this.fb.group({
      site: ['', Validators.required],
      url: ['', Validators.required],
      etat: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.serveurForm.valid) {
      this.serverService.createServeur(this.serveurForm.value).subscribe({
        next: () => {
          this.activeModal.close('Serveur ajouté');
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du serveur', err);
          // Vous pouvez ajouter une gestion d'erreur plus élaborée ici
        }
      });
    }
  }
}

