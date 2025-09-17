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
  selector: 'app-save-tag-without-amount',
  templateUrl: './save-tag-without-amount.component.html',
  styleUrls: ['./save-tag-without-amount.component.css'],
})
export class SaveTagWithouAmountComponent {
  @Input() data!: any;
  submitted = false;
  loading = false;
  disabledCompteId = false;
  compteClient: any;
  ticketData: any;

  tagForm!: FormGroup;

  constructor(
    public bsModalRef: BsModalRef,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.tagForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required, Validators.minLength(10)]],
      plaque: ['', [Validators.required, Validators.minLength(4)]],
      tagId: ['', [Validators.required]],
      tagCode: ['', [Validators.required, Validators.minLength(5)]],
      typeTag: ['CARTE', Validators.required],
      isExo: [false],
    });

    if (this.data !== '') {
      this.disabledCompteId = true;
      this.tagForm.patchValue({
        accountNumber: this.data,
      });
      this.getCompteClient(this.data);
    } else {
      this.disabledCompteId = false;
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.tagForm.controls;
  }

  onIsExoChange(event: any) {
    const isExo = event.target.checked;

    if (isExo) {
      this.tagForm.controls['montant'].setValue(0);
      this.tagForm.controls['montant'].disable();
    } else {
      this.tagForm.controls['montant'].enable();
    }
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
    const  tagId = this.generalService.transformerRfidcode(this.tagForm.value.tagId);
    this.tagForm.value.tagId  = tagId;
       const body = {
      accountNumber: this.tagForm.value.accountNumber,
      tagId: this.tagForm.value.tagId,
      tagCode: this.tagForm.value.tagCode,
      plaque: this.tagForm.value.plaque,
      isExo: this.tagForm.value.isExo,
      type_targ:this.tagForm.value.typeTag,
    }
    this.generalService.saveTargwithoutAmount(body).subscribe({
      next: ((data) =>{

        console.log("okokokokokoko",data);
        this.handleSuccess(data, 'Tag enregistré avec succès');
      }),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }


  transformInput(event:Event) {
    const input = event.target as HTMLInputElement;;
    const value = input.value;
    // Remplacer chaque caractère selon la map
    const transformedValue =this.generalService.transformerRfidcode(value);

    // Mettre à jour la valeur de l'input
    input.value = transformedValue;
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
    this.sweetAlertService.toastError(
      'Erreur !',
      5000,
      error.error.message ||
        error.error.error ||
        'Le service est temporairement indisponible'
    );
  }

  printReceiptContent() {
    if (!this.ticketData) {
      this.sweetAlertService.toastError('Données du ticket manquantes', 5000);
      return;
    }

    const receiptHtml = `
      <html>
        <head>
          <title>Reçu d'abonnement </title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 5px;
            }
            .text-center {
              text-align: center;
            }
            .text-end {
              text-align: end;
            }
            .mb-3 {
              margin-bottom: 5px;
            }

             footer {
          position: relative;
        bottom: 0;
        margin-top: 10px;
          }
      @page {
        margin: 0;
      }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="text-center mb-4">
            <h5>Reçu de paiement</h5>
            <p>Date : ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
          </div>

          <div class="mb-3">
            <p><strong>Client :</strong> ${this.ticketData.client?.nom || '-'}  ${this.ticketData.client?.prenom}</p>
            <p><strong>Numéro de compte :</strong> ${this.ticketData.compte?.accountNumber || '-'}</p>
            <p><strong>Code du Tag :</strong> ${this.ticketData.tagCode || '-'}</p>
            <p><strong>Solde :</strong> ${this.ticketData.compte?.solde ? this.ticketData.compte?.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }) : '-'}</p>
            <p><strong>Plaque :</strong> ${this.ticketData.plaque || '-'}</p>
          </div>

          <div class="text-end">
            <p>Merci pour votre paiement !</p>
            <p><em>Safer</em></p>
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
