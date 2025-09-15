import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { DateService } from 'src/app/services/date.service';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';
import { SaveTagComponent } from '../../save-tag/save-tag.component';
import { ListesClientService } from 'src/app/services/liste-client.service';

@Component({
  selector: 'app-add-client-litige',
  templateUrl: './add-client-litige.component.html',
  styleUrls: ['./add-client-litige.component.css']
})
export class AddClientLitigeComponent implements OnInit {
  date!: Date;
  clientForm!: FormGroup;
  submitted = false;
  loading = false;
  dataTransfert:any;
  tel?:string;
accountNumber: any;
tagCode: any;
montant: any;
dataRecharge: any;
  constructor(
    private formBuilder: FormBuilder,
    private dateService: DateService,
    private sweetAlertService: SweetAlertService,
    private modalService: BootstrapModalService,
    private generalService: GeneralService,
    private router:Router,
    private clientService:ListesClientService
  ) {}

  ngOnInit(): void {
    this.currentDate();
    this.clientForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.pattern(/^[0-9]{8,}$/)]],
      type: ['', [Validators.required]],
      cin: ['', [Validators.required, Validators.minLength(10)]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  currentDate() {
    this.dateService.currentDate$.subscribe((date) => {
      this.date = date;
    });
  }

  get form() {
    return this.clientForm.controls;
  }

onSubmitEdit() {
  if (!this.tel) {
    console.warn("Le numéro de téléphone est vide !");
    return; // stop si pas de tel
  }
this.getClientByTel(this.tel);
}


onSubmitTransfertTageCode () {
  console.log("tel", this.tel);
  if (!this.tagCode && !this.accountNumber) {
    console.warn("Le tagCode  est vide !");
    return; // stop si pas de tel
  }
    const body ={
      tagCode : this.tagCode,
      accountNumberTo : this.accountNumber
    }
    this.generalService.transferTagToCompte(body).subscribe({
      next: ((data) =>{

        this.dataTransfert = data;
        setTimeout(() => {
              this.handleSuccess(data, 'Tag transféré avec succès');
        }, 20);

        setTimeout(()=>{
          this.dataTransfert =null;
        },3000);
      }),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });


}

onSubmitRechargeCompte() {
  if (!this.montant || !this.accountNumber) {
    console.warn("Le montant ou le numéro de compte est vide !");
    return; // stop si champ manquant
  }

  this.generalService
    .rechargeAccount({
      accountNumber: this.accountNumber,
      montant: this.montant,
    })
    .subscribe({
      next: (data) => {
        if (data.status === 400) {
          this.sweetAlertService.toastError(
            'Erreur !',
            5000,
            "compteClient non trouvé"
          );
          return;
        }

        this.dataRecharge = data;
        this.handleSuccess(data, 'Compte rechargé avec succès');


        setTimeout(()=>{
          this.dataRecharge =null;
          this.montant ='';
        },3000);
      },

      error: (error: HttpErrorResponse) => this.handleError(error),
    });
}




  handleSuccess(data: any, message: string) {
    this.loading = false;
    this.generalService.successEvent.emit(data);
    this.sweetAlertService.toastSuccess(message, 5000);
    this.resetFormTransfert();
  }

   resetFormTransfert() {
   this.accountNumber ='';
   this.tagCode ='';
  }

   handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.generalService.failureEvent.emit(error);

    let message ="";
    if (error.error.message ="This account does not exist!") {
      message = "Ce compte n'existe pas !"
    }

    if (error.error.message ="This subscription does not exist!") {
      message = "Cet abonnement n'existe pas !"
    }
    this.sweetAlertService.toastError(
      'Erreur !',
      5000,
     message ||
        'Le service est temporairement indisponible'
    );
  }


   getClientByTel(tel: string) {
     this.clientService.getClientByTel(tel).subscribe(
       (data) => {

        if (!data) {

        this.sweetAlertService.toastError(
          "Cet numero n'existe pas",1000);
          return;
        }
     this.router.navigate(['/dashboard/clients/details/litige/', this.tel]);

       },
       (error) => {
         console.error(error);
        this.sweetAlertService.toastError(
          "Cet numero n'existe pas",500);

       }
     );
   }

  onSubmit() {
    this.submitted = true;
    if (this.clientForm.invalid) {
      return;
    }
    this.loading = true;

    this.generalService.saveClientOther(this.clientForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.sweetAlertService.toastSuccess('Client enregistré !', 5000);
        this.resetForm();

      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.sweetAlertService.toastError( 'Erreur !',5000, error.error.message || error.error.error || 'Le service est temporairement indisponible');
      }
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

  onInputNom(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }


  onInputEmail(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toLocaleLowerCase();
  }


  addTag(compteId: any) {
    this.modalService.openModal(SaveTagComponent, compteId, 'modal-md', true);
  }

  resetForm() {
    this.clientForm.reset();
    this.submitted = false;
    Object.keys(this.clientForm.controls).forEach((c) => {
      this.clientForm.controls[c].setErrors(null);
    });
  }

  goBack(){
    window.history.back();
  }

}
