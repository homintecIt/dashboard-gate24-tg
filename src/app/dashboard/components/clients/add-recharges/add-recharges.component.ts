import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import { PermissionService } from 'src/app/services/permission.service';
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
userRole:any;
  constructor(
    public bsModalRef: BsModalRef,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    public authService:AuthService

  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.userRole;

    console.log("role",this.userRole);
    this.rechargeForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required, Validators.minLength(8)]],
      tagCode: [''],
      montant:  this.userRole ==='Admin' ? [ '', [ Validators.required]] :  [ '', [ Validators.required, Validators.min(99)]]
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

            this.rechargeForm.controls['montant'].setValidators(
        this.userRole === 'Admin'
          ? [Validators.required, Validators.min(99)]
          : [Validators.required, ]
      );

      this.rechargeForm.controls['tagCode'].clearValidators();
    } else {
      this.rechargeForm.controls['tagCode'].setValidators([
        Validators.required,
        Validators.minLength(4),
      ]);
         this.rechargeForm.controls['montant'].setValidators(
        this.userRole === 'Admin'
          ? [Validators.required, Validators.min(99)]
          : [Validators.required, ]
      );

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

    const montant = this.formatToCurrency(this.ticketData.montant);
    const solde = this.ticketData.montant_apres_recharge
      ? this.formatToCurrency(this.ticketData.montant_apres_recharge)
      : '-';

    const receiptHtml = `
      <html>
        <head>
          <title>Reçu de Recharge</title>
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
              color: #083489;
              font-size: 12px;
              margin-bottom: 3px;
              font-weight: 600;
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
              color: #888;
              font-weight: 500;
            }

            .info-value {
              color: #333;
              font-weight: 600;
              text-align: right;
              word-break: break-word;
              max-width: 60%;
            }

            .amount-section {
              background: linear-gradient(135deg, #083489 0%, #052663 100%);
              color: white;
              padding: 8px;
              border-radius: 4px;
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
              color: #083489;
              font-weight: 600;
              font-size: 9px;
              margin-bottom: 5px;
            }

            .footer .company {
              font-size: 10px;
              font-weight: bold;
              color: #333;
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
              <h2>REÇU DE RECHARGE</h2>
              <p>${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <div class="info-row">
              <span class="info-label">Client</span>
              <span class="info-value">${this.ticketData.compte?.client?.nom || '-'} ${this.ticketData.compte?.client?.prenom || ''}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Compte</span>
              <span class="info-value">${this.ticketData.compte?.accountNumber || '-'}</span>
            </div>

            <div class="amount-section">
              <div class="amount-label">Montant Rechargé</div>
              <div class="amount-value">${montant}</div>
            </div>

            <div class="info-row">
              <span class="info-label">Nouveau Solde</span>
              <span class="info-value">${solde}</span>
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


  resetFormClose() {
    this.rechargeForm.reset();
    this.submitted = false;
    Object.keys(this.rechargeForm.controls).forEach((c) => {
      this.rechargeForm.controls[c].setErrors(null);
    });
    this.bsModalRef.hide();
  }
}
