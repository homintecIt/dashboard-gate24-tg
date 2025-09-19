import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';

@Component({
  selector: 'app-add-tag-compte',
  templateUrl: './add-tag-compte.component.html',
  styleUrls: ['./add-tag-compte.component.css']
})
export class AddTagCompteComponent implements OnInit {
  @Input() data!: any;
  submitted = false;
  loading = false;
  ticketData: any;
  isOldTag = true;
  isCompteAssocie = false;

  actualPassword = '';
  showPassword = true;


  tagForm!: FormGroup;

  constructor(
    public bsModalRef: BsModalRef,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.tagForm = this.formBuilder.group({
      tagId: ['', [Validators.required,]],
      compte_id: ['', Validators.required],
      tagCode: [''],
      plaque: [''],
      isExo: [false],
      typeTag: ['CARTE', Validators.required],
    });

    if (this.data !== '') {
      this.tagForm.patchValue({
        compte_id: this.data,
      });
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.tagForm.controls;
  }

  onChange(event: any) {
    const value = event.target.value;

    if (value.length > 10) {
      this.onSubmit();
    }
  }

    togglePassword(show: boolean) {
      this.showPassword = show;
    }


  onisOldTagChange(isOldTag: boolean) {
    if (isOldTag) {
      this.tagForm.controls['tagCode'].setValue(0);
      this.tagForm.controls['tagCode'].disable();
    } else {
      this.tagForm.controls['tagCode'].enable();
    }
  }

  onIsExoChange(event: any) {
    const isExo = event.target.checked;

    if (isExo) {
      //this.tagForm.controls['montant'].setValue(0);
      //this.tagForm.controls['montant'].disable();
    } else {
      //this.tagForm.controls['montant'].enable();
    }
  }
  onSubmit() {

    this.submitted = true;
    if (this.tagForm.invalid) {
      console.log(this.tagForm.value)
      return;
    }
    this.loading = true;

    const body = {
      compte_id: this.tagForm.value.compte_id,
      tagId: this.tagForm.value.tagId,
      tagCode: this.tagForm.value.tagCode,
      plaque: this.tagForm.value.plaque,
      isExo: this.tagForm.value.isExo,
      type_targ:this.tagForm.value.typeTag
    }

    this.generalService.addNewTagCompteClient(body).subscribe({
      next: (data) => this.handleSuccess(data, 'Tag enregistré avec succès'),
      error: ((error: HttpErrorResponse)=>{

        //console.log(error.error.status)
        if (error.error.status === 404) {
          console.error('Conflict Error:', error.error.message);
          this.isOldTag = true;
          this.isCompteAssocie = true;
          this.generalService.failureEvent.emit(error);
          this.loading = false;

        } else {
          this.isCompteAssocie = false;
        this.handleError(error)

        }
      }),
    });


   /*  if (this.isOldTag) {

      const body = {
        compte_id: this.tagForm.value.compte_id,
        tagId: this.tagForm.value.tagId,
      }
      this.generalService.addTagCompteClient(body).subscribe({
        next: (data) => this.handleSuccess(data, 'Tag associé au compte avec succès'),
        error: ((error)=>{

          console.log(error.error.status)
          if (error.error.status === 409) {
            console.error('Conflict Error:', error.error.message);
            this.isOldTag = true;
            this.isCompteAssocie = true;
            this.generalService.failureEvent.emit(error);
            this.loading = false;

          } else {
            this.isCompteAssocie = false;
          this.handleError(error)

          }
         // console.log(error)
        }),
      });

    }else {
          } */

  }



  handleSuccess(data: any, message: string) {
    this.loading = false;
    this.generalService.successEvent.emit(data);
    this.ticketData = data;
    this.sweetAlertService.toastSuccess(message, 5000);
    //this.printReceiptContent();
    this.resetFormClose();
  }

  handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.isOldTag = false;
    // this.onisOldTagChange(false);
    this.generalService.failureEvent.emit(error);
    // this.sweetAlertService.toastError(
    //   'Erreur !',
    //   5000,
    //   error.error.message ||
    //     error.error.error ||
    //     'Le service est temporairement indisponible'
    // );
  }

  printReceiptContent() {
    if (!this.ticketData) {
      this.sweetAlertService.toastError('Données du ticket manquantes', 5000);
      return;
    }

    const receiptHtml = `
      <html>
        <head>
          <title>Reçu ajout de tag</title>
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
            <h5>Reçu de ajout de tag</h5>
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
            <p>Merci pour votre vidélité !</p>
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


  transformInput(event:Event) {
    const input = event.target as HTMLInputElement;;
    const value = input.value;
    // Remplacer chaque caractère selon la map
    const transformedValue =this.generalService.transformerRfidcode(value);

    // Mettre à jour la valeur de l'input
    input.value = transformedValue;
  }

}
