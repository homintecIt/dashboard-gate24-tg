import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { storageHelper } from 'src/app/misc/storage.misc';
import { searchType } from 'src/app/misc/utilities.misc';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';

@Component({
  selector: 'app-recherche-modal',
  templateUrl: './recherche-modal.component.html',
  styleUrls: ['./recherche-modal.component.css']
})
export class RechercheModalComponent implements OnInit {
  @Input() data: string = ''; 
  searchForm!: FormGroup;
  modalTitle: string = 'Recherche';
  placeholder: string = '';
  submitted = false;
  loading = false;
  results: any;

  constructor(
    public bsModalRef: BsModalRef,
    private generalService: GeneralService,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    storageHelper.local.remove(`${searchType}`);
    //console.log("this.data", this.data);
    if (this.data !== '') {
      if (this.data === 'accountNumber') {
        this.modalTitle = 'Recherche par numéro de compte';
        this.placeholder = 'Entrez le numéro de compte'
      }

      if (this.data === 'tagCode') {
        this.modalTitle = 'Recherche par code Tag';
        this.placeholder = 'Entrez le code Tag'
      }

      if (this.data === 'name') {
        this.modalTitle = 'Recherche par nom et prénoms';
        this.placeholder = 'Entrez le nom et prénoms'
      }

      if (this.data === 'phoneNumber') {
        this.modalTitle = 'Recherche par numéro de téléphone';
        this.placeholder = 'Entrez le numéro de téléphone'
      }

      if (this.data === 'targID') {
        this.modalTitle = 'Recherche par ID Tag';
        this.placeholder = 'Entrez l\'ID Tag'
      }
    }

    this.searchForm = this.formBuilder.group({
      searchTerm: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get form(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }

  onSubmit(){
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.loading = true;

    const body = this.searchForm.value.searchTerm;

    if (this.data === 'accountNumber') {
      this.generalService.getCompteClient(body).subscribe({
        next: (resp) => {
          if (resp === null) {
            this.loading = false;
            this.sweetAlertService.toastWarning('Le compte n\'existe pas.', 5000);
          } else {
            const data = {
              type: 'accountNumber',
              value: body,
            };
            storageHelper.local.store(`${searchType}`, data);
            this.handleSuccess(resp);
          }
        },
        error: (error: HttpErrorResponse) => this.handleError(error)
      });
    }

    if (this.data === 'name') {
      const name = this.searchForm.value.searchTerm.split(' ');
      const firstName = name[0];
      const lastName = name[1];
      const body = {
        nom: firstName,
        prenom: lastName
      }
      this.generalService.searchWithName(body).subscribe({
        next: (resp: any) =>{
          if (resp === null) {
            this.loading = false;
            this.sweetAlertService.toastWarning('Le nom et prénoms n\'existe pas.', 5000);
          } else {
            const data = {
              type: 'name',
              value: body,
            };
            storageHelper.local.store(`${searchType}`, data);
            this.handleSuccess(resp);
          }
        },
        error: (error: HttpErrorResponse) => this.handleError(error)
      })
    }

    if (this.data === 'tagCode') {
      this.generalService.searchWithTagCode(body).subscribe({
        next: (resp) => {
          if (resp === null) {
            this.loading = false;
            this.sweetAlertService.toastWarning('Le code Tag n\'existe pas.', 5000);
          } else {
            const data = {
              type: 'tagCode',
              value: body,
            };
            storageHelper.local.store(`${searchType}`, data);
            this.handleSuccess(resp);
          }
        },
        error: (error: HttpErrorResponse) => this.handleError(error)
      });
    }

    if (this.data === 'phoneNumber') {
      this.generalService.searchWithPhoneNumber(body).subscribe({
        next: (resp) => {
          if (resp === null) {
            this.loading = false;
            this.sweetAlertService.toastWarning('Le numéro de téléphone n\'existe pas.', 5000);
          } else {
            const data = {
            type: 'phoneNumber',
            value: body,
          };
          storageHelper.local.store(`${searchType}`, data);
          this.handleSuccess(resp);
          }
        },
        error: (error: HttpErrorResponse) => this.handleError(error)
      });
    }

    if (this.data === 'targID') {
    const bodyData =  this.generalService.transformerRfidcode(body);
      this.generalService.searchWithTagID(bodyData).subscribe({
        next: (resp) => {
          if (resp === null) {
            this.loading = false;
            this.sweetAlertService.toastWarning('L\'ID Tag n\'existe pas.', 5000);
          } else {
            const data = {
              type: 'targID',
              value: body,
            };
            storageHelper.local.store(`${searchType}`, data);
            this.handleSuccess(resp);
          }
        },
        error: (error: HttpErrorResponse) => this.handleError(error)
      });
    }

  }

    handleSuccess(data: any) {
    this.loading = false;
   this.goToDetail(data);
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

  closeModal() {
    this.bsModalRef.hide();
    this.resetForm();
  }

  resetForm() {
    this.searchForm.reset();
    this.submitted = false;
    Object.keys(this.searchForm.controls).forEach((c) => {
      this.searchForm.controls[c].setErrors(null);
    });
  }

  goToDetail(result: any) {
    this.resetForm();
    console.log('Result: ',result);

    this.bsModalRef.hide();

    if (this.data === 'accountNumber') {
     return this.router.navigate(['/dashboard/show-compte'], { state: { data: result } });
    }
    if (this.data === 'tagCode') {
     return this.router.navigate(['/dashboard/show/tag'], { state: { data: result } });
    }

    if (this.data === 'targID') {
      return this.router.navigate(['/dashboard/show/tag'], { state: { data: result } });
    }
   ///return this.router.navigate(['/dashboard/clients/details/'], { state: { data: result } });

    if (result && result.tel) {
    return this.router.navigate(['/dashboard/clients/details', result.tel] );

    }else if(result && result.compte.client.tel){

      console.log(result);
    return this.router.navigate(['/dashboard/clients/details', result.compte.client.tel] );
    }

    else{
      return;
    }

  }

  transformInput(event:any) {
    const input = event.target;
    const value = input.value;
    // Remplacer chaque caractère selon la map
    const transformedValue =this.generalService.transformerRfidcode(value);
    // Mettre à jour la valeur de l'input
    input.value = transformedValue;

  }
}
