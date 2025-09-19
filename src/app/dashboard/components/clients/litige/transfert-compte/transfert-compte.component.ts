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
import Swal from 'sweetalert2';
import { swalAnimation } from 'src/app/misc/utilities.misc';
const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});

@Component({
  selector: 'app-transfert-compte',
  templateUrl: './transfert-compte.component.html',
  styleUrls: ['./transfert-compte.component.css'],
})
export class TransfertCompteComponent {
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
   /// this.comptes = this.data.comptes.filter((item:any) => item !== this.data.compte.accountNumber);
    this.tagForm = this.formBuilder.group({
      accountNumberOf: ['', [Validators.required, Validators.minLength(10)]],
    });

    if (this.data !== '') {
      this.disabledCompteId = true;

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

    console.log("okokokookkokokokokokokoko");

    this.submitted = true;
    if (this.tagForm.invalid) {
      return;
    }
    this.loading = true;
    const body ={
      accountNumberOf : this.tagForm.value.accountNumberOf,
      clientId : this.data ,
    }


    console.log("okokokookk body okokokokokokoko",body);

    swalWithBootstrapButtons
          .fire({
            title: 'Attention !!!',
            text: `Le transfert de compte implique le transfére du compte principal vers le client actuel.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Continuer',
            cancelButtonText: 'Annuler',
            confirmButtonColor: ' #0d6efd',
            cancelButtonColor: '#6c757d',
            allowOutsideClick: false,
            allowEscapeKey: false,
            reverseButtons: false,
            ...swalAnimation
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.saveTransfert(body);
            } else {
            }
          });


  }


  saveTransfert(body:any){
       this.generalService.transferCompteClient(body).subscribe({
      next: ((data) =>{
            setTimeout(() => {
              this.handleSuccess(data, 'solde transféré avec succès');
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
