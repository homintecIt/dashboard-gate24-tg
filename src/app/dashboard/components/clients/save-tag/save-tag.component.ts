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
  selector: 'app-save-tag',
  templateUrl: './save-tag.component.html',
  styleUrls: ['./save-tag.component.css'],
})
export class SaveTagComponent {
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
      montant: [ '', [ Validators.required, Validators.min(99)]],
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
      montant: this.tagForm.value.montant,
    }
    this.generalService.saveTag(body).subscribe({
      next: ((data) =>{
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

    const montantPaye = this.ticketData.compte?.solde
      ? this.ticketData.compte.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })
      : this.tagForm.value.montant;
    const solde = this.ticketData.compte?.solde
      ? this.ticketData.compte.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })
      : this.tagForm.value.montant;

    const receiptHtml = `
      <html>
        <head>
          <title>Reçu de Paiement</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            html, body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: white;
              padding: 0;
              margin: 0;
            }

            .receipt {
              background: white;
              width: 80mm;
              padding: 5px;
            }

            .header {
              text-align: center;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 2px dashed #e0e0e0;
            }

            .logo {
              width: 40px;
              height: 40px;
              margin: 0 auto 8px;
            }

            .logo img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }

            .header h2 {
              font-size: 12px;
              margin-bottom: 3px;
              font-weight: 900;
            }

            .header p {
              color: #666;
              font-size: 8px;
            }

            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              font-size: 9px;
            }

            .info-label {
              color: black;
              font-weight: 500;
            }

            .info-value {
              color: black;
              font-weight: 600;
              text-align: right;
              word-break: break-word;
              max-width: 60%;
            }

            .amount-section {
              color: black;
              padding: 8px;
              border-radius: 4px;
              font-weight:900;
              margin: 10px 0;
              text-align: center;
            }

            .amount-label {
              font-size: 8px;
              opacity: 0.9;
              margin-bottom: 2px;
            }

            .amount-value {
              font-size: 14px;
              font-weight: bold;
            }

            .divider {
              border-top: 2px dashed #e0e0e0;
              margin: 10px 0;
            }

            .footer {
              text-align: center;
              margin-top: 10px;
            }

            .footer p {
              color: #666;
              font-size: 8px;
              margin-bottom: 2px;
            }

            .footer .thank-you {
              font-weight: 600;
              font-size: 9px;
              margin-bottom: 5px;
            }

            @media print {
              html, body {
                background: white;
                padding: 0;
                margin: 0;
              }

              .receipt {
                box-shadow: none;
                border: none;
                width: 80mm;
              }

              @page {
                margin: 0;
                size: 80mm auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="logo">
                <img src="/assets/img/logo.png" alt="SAFER Logo" onerror="this.style.display='none'">
              </div>
              <h2>REÇU DE PAIEMENT</h2>
              <p>${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <div class="info-row">
              <span class="info-label">Client</span>
              <span class="info-value">${this.ticketData.client?.nom || '-'} ${this.ticketData.client?.prenom || ''}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Compte</span>
              <span class="info-value">${this.ticketData.compte?.accountNumber || '-'}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Code Tag</span>
              <span class="info-value">${this.ticketData.tagCode || '-'}</span>
            </div>

            <div class="amount-section">
              <div class="amount-label">Montant Payé</div>
              <div class="amount-value">${montantPaye}</div>
            </div>

            <div class="info-row">
              <span class="info-label">Solde</span>
              <span class="info-value">${solde}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Plaque</span>
              <span class="info-value">${this.ticketData.plaque || '-'}</span>
            </div>

            <div class="divider"></div>

            <div class="footer">
              <p class="thank-you">Merci pour votre confiance !</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create an iframe to print without opening a new window
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(receiptHtml);
      iframeDoc.close();

      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    } else {
      this.sweetAlertService.toastError('Échec de l\'impression', 5000);
      document.body.removeChild(iframe);
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
