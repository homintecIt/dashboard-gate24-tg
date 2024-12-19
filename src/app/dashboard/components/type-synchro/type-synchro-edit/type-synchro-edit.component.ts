import { Component, OnInit } from '@angular/core';
import { TypeSynchroServiceService } from '../../services/type-synchro-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-type-synchro-edit',
  template:`
  <div class="modal-header">
  <h4 class="modal-title">Ajouter un Serveur</h4>
  <button type="button" class="btn-close" (click)="this.bsModalRef.hide()"></button>
</div>
<div class="modal-body">

  <form [formGroup]="editForm" >

    <div class="mb-3">
      <label class="form-label">Type</label>
      <select
              class="form-select"
              id="type"
              formControlName="type"
            >

              <option value="passage">passage</option>
              <option value="abonnement">abonnement</option>
              <option value="recharge">recharge panne</option>
              <option value="client">client</option>
              <option value="compte">compte</option>
              <option value="updateClient">updateClient</option>
              <option value="updateAbonnement'">updateAbonnement'</option>
            </select>
      <div
        *ngIf="editForm.get('type')?.invalid && (editForm.get('type')?.dirty || editForm.get('type')?.touched)"
        class="text-danger"
      >
        Le type est requis
      </div>
    </div>

    <app-cron-select
    formControlName="time"
      [selectedValue]="currentCronValue"
      (cronSelected)="onCronValueSelected($event)">
    </app-cron-select>


    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        (click)="this.bsModalRef.hide()"
      >
        Annuler
      </button>
      <button type="button" class="btn btn-primary"
            (click)="onSubmit()"
            [disabled]="editForm.invalid || isSubmitting">
      <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
      Modifier
    </button>
    </div>
  </form>
</div>

  `,
  styleUrls: ['./type-synchro-edit.component.css']
})
export class TypeSynchroEditComponent implements OnInit{
  editForm!: FormGroup;
  currentCronValue: string = '';
  data: any;
  types:any ;
  loading = false;
  isSubmitting = false;
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private  typeSynchroService: TypeSynchroServiceService
  ) {

  }
ngOnInit():void{
  console.log("ok");

  if (this.data) {
    this.currentCronValue= this.data.time
    this.editForm = this.fb.group({
      type: [this.data.type, Validators.required],
      status: [this.data.status, Validators.required],
      id: [this.data.id, Validators.required],
      time:[this.data.time, ]
    });
    console.log(this.editForm.value.time);

  }
}
onCronValueSelected(cronValue: string) {
  this.currentCronValue = cronValue;
  //ajouter au formulaire
  this.editForm.value.time= this.currentCronValue
  console.log('Expression CRON sélectionnée:', cronValue);
  // Faites quelque chose avec la valeur CRON...
}

  onSubmit() : void{
    if (this.editForm.valid && !this.isSubmitting) {
      console.log(this.editForm.value.time);

      this.isSubmitting = true;
      this.typeSynchroService.updateSynchroStatus(this.editForm.value.type,this.editForm.value.status,this.editForm.value.id,this.editForm.value.time).subscribe({
        next: (response:any) => {
          this.isSubmitting = false;
          this.bsModalRef.hide();
          // Émettre un événement pour rafraîchir la liste
          this.typeSynchroService.onSuccess(response);
        },
        error: (err) => {
          console.error('Erreur lors de mise a jour de la synchro', err);
          this.isSubmitting = false;


        }
      });
    }
  }
}
