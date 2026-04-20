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
import { site } from 'src/app/misc/api-endpoints.misc';
import { da } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { data } from 'jquery';

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
site: any;
sitePassage: any;

voie: any;
datePassage: any;

// Account creation variables
clientsList: any[] = [];
selectedClient: any = null;
searchClientQuery: string = '';
loadingClients = false;
private destroy$ = new Subject<void>();
createdAccount: any = null;
showAccountInfo = false;

private searchSubject = new Subject<string>();
currentPage = 1;
itemsPerPage = 10;

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

    this.site = `${site}`
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

    // Load clients for account creation
    this.loadClients();

       this.searchSubject.pipe(
      debounceTime(300), // Attendre 300ms après la dernière frappe
      distinctUntilChanged(), // Ignorer si la valeur est identique à la précédente
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      // Réinitialiser à la page 1 lors d'une nouvelle recherche
      this.currentPage = 1;

      // Charger les abonnements avec le terme de recherche
      this.loadClients(this.currentPage, searchTerm);
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

    if (this.site !='DIRECTION') {

        this.sweetAlertService.toastError(
      'Erreur !',
      5000,
          "Vous ne pouvez pas effectuer cette transaction depuis ce site. Connectez-vous à la plateforme de la direction."
      );
    return; // stop si champ manquant

  }
this.getClientByTel(this.tel);
}


onSubmitTransfertTageCode () {

    if (this.site !='DIRECTION') {

        this.sweetAlertService.toastError(
      'Erreur !',
      5000,
          "Vous ne pouvez pas effectuer cette transaction depuis ce site. Connectez-vous à la plateforme de la direction."
      );
    return; // stop si champ manquant

  }
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


  if (this.site !='DIRECTION') {

        this.sweetAlertService.toastError(
      'Erreur !',
      5000,
          "Vous ne pouvez pas effectuer cette transaction depuis ce site. Connectez-vous à la plateforme de la direction."
      );
    return; // stop si champ manquant

  }
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



onSubmitPassages() {
  if (!this.tagCode || !this.site || !this.voie|| !this.datePassage) {
    console.warn("Le site ou le voie, date est vide !");

    console.log("oaddd", this.datePassage);

    return; // stop si champ manquant
  }


  if (this.site =='DIRECTION') {

        this.sweetAlertService.toastError(
      'Erreur !',
      5000,
          "Vous ne pouvez pas effectuer cette transaction de passage depuis le site de la Direction. Connectez-vous au site du passage concerné."
      );
    return; // stop si champ manquant

  }

  this.generalService
    .passages({
      site: this.site,
      voie: this.voie,
      montantPassage: 500,
      tagCode: this.tagCode,
      datePassage: this.datePassage,
    })
    .subscribe({
      next: (data) => {
        this.handleSuccess(data, 'Passage effectué  avec succès');
        setTimeout(()=>{
          this.voie =null;
          this.tagCode ='';
          this.datePassage ='';

        },3000);
      },

      error: (error: HttpErrorResponse) => this.handleErrorLigite(error),
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


     handleErrorLigite(error: HttpErrorResponse) {
    this.loading = false;
    this.generalService.failureEvent.emit(error);

    let message =error.error.message;

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

  // Account creation methods
   loadClients(page: number = 1, filter?: string | undefined): void {
    this.loadingClients = true;
    this.clientService
      .loadClients(page, this.itemsPerPage, filter)
      .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        // Ensure data is an array
        this.clientsList = Array.isArray(data) ? data : (data?.items || []);
        this.loadingClients = false;

        console.log('Clients loaded:', this.clientsList);
      },
      error: (error) => {
        this.loadingClients = false;
        this.clientsList = [];
        console.error('Error loading clients:', error);
        this.sweetAlertService.toastError('Erreur !', 5000, 'Impossible de charger la liste des clients');
      }
    });
  }


 

  searchClients(query: string) {

    console.log('Searching clients...', query);
    this.searchClientQuery = query;

    // Clear selected client when query is cleared
    if (query.length === 0) {
      this.selectedClient = null;
    }

    if (query.length < 2) {
      this.loadClients();
      console.log('Loading clients...');
      return;
    }
    //this.loadClients(this.currentPage, this.searchClientQuery);
    this.searchSubject.next(this.searchClientQuery);
  }



      // Nouvelle configuration pour la recherche dynamique
     

    onSearch(event: any): void {
    const searchTerm = event.target.value;
    this.searchSubject.next(searchTerm);
  }



  selectClient(client: any) {
    this.selectedClient = client;
    this.searchClientQuery = `${client.nom} ${client.prenom} - ${client.tel}`;
  }

  createAccount() {
    if (!this.selectedClient) {
      this.sweetAlertService.toastError('Erreur !', 5000, 'Veuillez sélectionner un client');
      return;
    }

    if (this.site !== 'DIRECTION') {
      this.sweetAlertService.toastError(
        'Erreur !',
        5000,
        "Vous ne pouvez pas effectuer cette transaction depuis ce site. Connectez-vous à la plateforme de la direction."
      );
      return;
    }

    // Confirmation alert
    Swal.fire({
      title: 'Confirmer la création',
      text: `Voulez-vous vraiment créer un compte pour le client ${this.selectedClient.nom} ${this.selectedClient.prenom} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#083489',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, créer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performAccountCreation();
      }
    });
  }

  performAccountCreation() {
    this.loading = true;
    const accountData = {
      client_id: this.selectedClient.id || this.selectedClient.uuid,
      solde: 0
    };

    this.generalService.createClientCompte(accountData).subscribe({
      next: (response) => {
        this.loading = false;
        this.createdAccount = response;
        this.showAccountInfo = true;
        this.sweetAlertService.toastSuccess('Compte créé avec succès !', 5000);
        // Reset form
        this.selectedClient = null;
        this.searchClientQuery = '';
        //this.loadClients();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.sweetAlertService.toastError(
          'Erreur !',
          5000,
          error.error.message || 'Erreur lors de la création du compte'
        );
      }
    });
  }

  hideAccountInfo() {
    this.showAccountInfo = false;
    this.createdAccount = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
