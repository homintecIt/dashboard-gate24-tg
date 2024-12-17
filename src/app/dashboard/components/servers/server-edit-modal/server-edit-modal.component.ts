import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ServerService } from '../../services/servers.service';

@Component({
  selector: 'app-server-edit-modal',
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
        <div class=" mb-3">
          <label class="form-label">Nom du  site</label>
          <input type="text" class="form-control" formControlName="site">
        </div>
      </div>
    <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">URL su site</label>
          <input type="text" class="form-control" formControlName="url">
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Etat</label>
          <select id="role" class="form-control" formControlName="etat">
          <option value="actif">Actif</option>
              <option value="inactif"  >Inactif</option>
              <option value="en_panne" >En panne</option>
              <option value="maintenance" >Maintenance</option>
      </select>
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
export class ServerEditModalComponent   implements OnInit  {
  editForm!: FormGroup ;
  server?: any; // Pour recevoir l'ID depuis le modal service
  loading = false;
  isSubmitting = false;
  data: any;


  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private serverService: ServerService
  ) {

  }

  ngOnInit(): void {
    console.log(this.data);

    this.editForm = this.fb.group({
      url: this.data.url,
      etat: this.data.etat,
      site: this.data.site,
      id: this.data.id
    });
  }
  onSubmit():void{
    if (this.editForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const updateData = this.editForm.value;

      this.serverService.updateServerData(updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.bsModalRef.hide();
          // Émettre un événement pour rafraîchir la liste
          this.serverService.refreshServeurs().subscribe();
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
