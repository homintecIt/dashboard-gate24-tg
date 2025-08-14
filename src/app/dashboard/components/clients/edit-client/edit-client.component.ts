import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { storageHelper } from 'src/app/misc/storage.misc';
import { searchType } from 'src/app/misc/utilities.misc';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  @Input() data!: any;
  submitted = false;
  loading = false;
  compteClient: any;

  clientForm!: FormGroup;

  constructor(
    public bsModalRef: BsModalRef,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.clientForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required,]],
      type: ['', [Validators.required]],
      cin: ['', [Validators.required, Validators.minLength(10)]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
    });

    if (this.data !== '') {
      this.clientForm.patchValue({
        nom: this.data.nom,
        prenom: this.data.prenom,
        email: this.data.email,
        tel: this.data.tel,
        type: this.data.typeClient,
        cin: this.data.cin,
        adresse: this.data.adresse
      });
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.clientForm.controls;
  }


  onSubmit() {
    this.submitted = true;
    if (this.clientForm.invalid) {
      return;
    }
    this.loading = true;

    this.generalService.updateClient(this.clientForm.value, this.data.uuid).subscribe({
      next: (resp) => {
        const data = {
          type: 'phoneNumber',
          value: resp.tel,
        };
        storageHelper.local.store(`${searchType}`, data);
        this.handleSuccess(resp, 'Client mis à jour avec succès')
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  handleSuccess(data: any, message: string) {
    this.loading = false;
    this.generalService.successEvent.emit(data);
    this.sweetAlertService.toastSuccess(message, 5000);
    this.resetFormClose();
  }

  handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.generalService.failureEvent.emit(error);
    this.sweetAlertService.toastError(
      'Erreur !',
      5000,
      error.error.message ||
        error.error.error ||
        'Le service est temporairement indisponible'
    );
  }

  resetForm() {
    this.clientForm.reset();
    this.submitted = false;
    Object.keys(this.clientForm.controls).forEach((c) => {
      this.clientForm.controls[c].setErrors(null);
    });
  }

  resetFormClose() {
    this.resetForm();
    this.bsModalRef.hide();
  }
}
