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
  selector: 'app-save-compte',
  templateUrl: './save-compte.component.html',
  styleUrls: ['./save-compte.component.css'],
})
export class SaveCompteComponent {
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
      client_id: ['', [Validators.required]],
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
        client_id: this.data,
      });
    } else {
      this.disabledCompteId = false;
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.tagForm.controls;
  }

    actualPassword = '';
  showPassword = true;

  togglePassword(show: boolean) {
    this.showPassword = show;
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
    this.tagForm.value.tagId  =  tagId;
    this.generalService.saveCompte(this.tagForm.value).subscribe({
      next: ((data) =>{
        this.handleSuccess(data, 'Compte creé avec succès');
      }),
      error: ((error: HttpErrorResponse)=>{
        this.handleError(error)
      }),
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
