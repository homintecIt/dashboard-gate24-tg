import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';

@Component({
  selector: 'app-add-recharges',
  templateUrl: './add-recharges.component.html',
  styleUrls: ['./add-recharges.component.css'],
})
export class AddRechargesComponent implements OnInit {
  @Input() data!: any;
  submitted = false;
  loading = false;

  rechargeForm!: FormGroup;
  rechargeType: 'compte' | 'tag' = 'compte';
  deactivated: boolean = false;

  ticketData: any;

  constructor(
    public bsModalRef: BsModalRef,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.rechargeForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required, Validators.minLength(8)]],
      tagCode: [''],
      montant: [ '', [ Validators.required, Validators.min(99)]]
    });

    if (this.data !== '') {
      this.deactivated = true;
      if (this.data.type === 'compte') {
        this.onRechargeTypeChange('compte');
        this.rechargeForm.patchValue({
          accountNumber: this.data.data
        });
      } else {
        this.onRechargeTypeChange('tag');
        this.rechargeForm.patchValue({
          tagCode: this.data.data
        });
      }
    }

  }

  get form(): { [key: string]: AbstractControl } {
    return this.rechargeForm.controls;
  }

  onRechargeTypeChange(type: 'compte' | 'tag') {
    this.rechargeType = type;
    this.resetForm();

    if (type === 'compte') {
      this.rechargeForm.controls['accountNumber'].setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
      this.rechargeForm.controls['montant'].setValidators([
        Validators.required, Validators.min(99)
      ]);
      this.rechargeForm.controls['tagCode'].clearValidators();
    } else {
      this.rechargeForm.controls['tagCode'].setValidators([
        Validators.required,
        Validators.minLength(4),
      ]);
      this.rechargeForm.controls['montant'].setValidators([
        Validators.required, Validators.min(99)
      ]);
      this.rechargeForm.controls['accountNumber'].clearValidators();
    }
    this.rechargeForm.controls['accountNumber'].updateValueAndValidity();
    this.rechargeForm.controls['tagCode'].updateValueAndValidity();
    this.rechargeForm.controls['montant'].updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true;
    if (this.rechargeForm.invalid) {
      return;
    }
    this.loading = true;

    const formData = this.rechargeForm.value;

    if (this.rechargeType === 'compte') {
      this.generalService
        .rechargeAccount({
          accountNumber: formData.accountNumber,
          montant: formData.montant,
        })
        .subscribe({
          next: (data) =>
            this.handleSuccess(data, 'Compte rechargé avec succès'),
          error: (error: HttpErrorResponse) => this.handleError(error),
        });
    } else {
      this.generalService
        .rechargeTag({ tagCode: formData.tagCode, montant: formData.montant })
        .subscribe({
          next: (data) => this.handleSuccess(data, 'Tag rechargé avec succès'),
          error: (error: HttpErrorResponse) => this.handleError(error),
        });
    }
  }

  handleSuccess(data: any, message: string) {
    this.loading = false;
    this.generalService.successEvent.emit(data);
    this.ticketData = data;
    this.sweetAlertService.toastSuccess(message, 5000);
    this.printReceiptContent();
    this.resetFormClose();
  }

  handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.generalService.failureEvent.emit(error);
    this.sweetAlertService.toastError( 'Erreur !',5000, error.error.message || error.error.error || 'Le service est temporairement indisponible');
  }

  resetForm() {
    this.rechargeForm.reset();
    this.submitted = false;
    Object.keys(this.rechargeForm.controls).forEach((c) => {
      this.rechargeForm.controls[c].setErrors(null);
    });
  }


   formatToCurrency(value:any) {
    const number = Number(value);
    if (isNaN(number)) {
      throw new Error('Valeur invalide. Impossible de convertir en nombre.');
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(number);
  }

  printReceiptContent() {
    if (!this.ticketData) {
      this.sweetAlertService.toastError('Données du ticket manquantes', 5000);
      return;
    }

    const montant  = this.formatToCurrency(this.ticketData.montant);

    const receiptHtml = `
      <html>
        <head>
          <title>Reçu de recharge</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .text-center {
              text-align: center;
            }
            .text-end {
              text-align: end;
            }
            .mb-3 {
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="d-flex flex-column align-items-center justify-content-between mb-4">
           <img src="/assets/img/logo.png" alt="logo" width="50">
            <h5>Reçu de Recharge</h5>
            <p>Date : ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
          </div>

          <div class="mb-3">
            <p><strong>Client :</strong> ${(this.ticketData.compte.client.nom )|| '-'}  ${this.ticketData.compte.client.prenom}</p>
            <p><strong>Numéro de compte :</strong> ${this.ticketData.compte?.accountNumber || '-'}</p>
            <p><strong>Montant :</strong> ${this.ticketData.montant ? montant : '-'}</p>
            <p><strong>Solde :</strong> ${this.ticketData.montant_apres_recharge ? this.ticketData.montant_apres_recharge.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }) : '-'}</p>
          </div>

          <div class="text-end">
            <p>Merci pour votre paiement !</p>
            <p><em>FSR B</em></p>
            <p><em></em></p>
            <p><em></em></p>
            <p><em></em></p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
    } else {
      this.sweetAlertService.toastError('Échec de l\'ouverture de la fenêtre d\'impression', 5000);
    }
  }


  resetFormClose() {
    this.rechargeForm.reset();
    this.submitted = false;
    Object.keys(this.rechargeForm.controls).forEach((c) => {
      this.rechargeForm.controls[c].setErrors(null);
    });
    this.bsModalRef.hide();
  }
}
