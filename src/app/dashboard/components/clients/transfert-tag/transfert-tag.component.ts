import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';

@Component({
  selector: 'app-transfert-tag',
  templateUrl: './transfert-tag.component.html',
  styleUrls: ['./transfert-tag.component.css'],
})
export class TransfertTagComponent {
  @Input() data!: any;
  submitted = false;
  loading = false;
  disabledCompteId = false;
  compteClient: any;
  ticketData: any;
  comptes : any;
  tagForm!: FormGroup;

  constructor(
    public bsModalRef: BsModalRef,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    ///this.comptes = this.data.comptes.filter((item:any) => item !== this.data.abonnement.compte.accountNumber);
    this.tagForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required, Validators.minLength(10)]],
      accountNumberTo: ['', [Validators.required, Validators.minLength(10)]],
      tagCode: ['', [Validators.required, Validators.minLength(5)]],
    });

    if (this.data !== '') {
      this.disabledCompteId = true;
      this.tagForm.patchValue({
        accountNumber: this.data.abonnement.compte.accountNumber,
        tagCode : this.data.abonnement.tagCode
      });
      ///this.getCompteClient(this.data);
    } else {
      this.disabledCompteId = false;
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.tagForm.controls;
  }


  getCompteClient(id: any) {
    this.generalService.getCompteClient(id).subscribe({
      next: (data) => (this.compteClient = data),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  onChangeCompteId(event: any) {
    const compteId = event.target.value;
    if (compteId.length > 10) {
      this.getCompteClient(compteId);
    } else {
      this.compteClient = null;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.tagForm.invalid) {
      return;
    }
    this.loading = true;
    const body ={
      tagCode : this.data.abonnement.tagCode,
      accountNumberTo : this.tagForm.value.accountNumberTo
    }
    this.generalService.transferTagToCompte(body).subscribe({
      next: ((data) =>{

        setTimeout(() => {
              this.handleSuccess(data, 'Tag transféré avec succès');
        }, 20);
      }),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }


  handleSuccess(data: any, message: string) {
    this.loading = false;
    this.generalService.successEvent.emit(data);
    this.ticketData = data;
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
    this.tagForm.reset();
    this.submitted = false;
    Object.keys(this.tagForm.controls).forEach((c) => {
      this.tagForm.controls[c].setErrors(null);
    });
  }

  resetFormClose() {
    this.resetForm();
    this.bsModalRef.hide();
  }
}
