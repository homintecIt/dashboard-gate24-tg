import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListesClientService } from 'src/app/services/liste-client.service';

@Component({
  selector: 'app-edit-client-modal',
  templateUrl: './edit-client-modal.component.html',
  styleUrls: ['./edit-client-modal.component.css']
})
export class EditClientModalComponent implements OnInit {
  @Input() data!: any;
  clientForm: FormGroup;
  isSubmitting: boolean = false;
  isLoading: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private clientService: ListesClientService
  ) {
    // Initialisation du formulaire
    this.clientForm = this.fb.group({
      id: [0],
      uuid: [''],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: [null, Validators.required],
      adresse: [''],
      cin: ['']
    });
  }

  ngOnInit(): void {
    // Vérification si les données sont présentes pour l'édition
    this.data
    if (this.data && this.data.uuid) {
      this.isLoading = true;
      console.log(this.data)

      this.clientService.getClient(this.data.uuid).subscribe({
        next: (clientDetail) => {
          this.data = clientDetail;
          this.clientForm.patchValue({
            nom: clientDetail.nom || '',
            prenom: clientDetail.prenom || '',
            email: clientDetail.email || '',
            tel: clientDetail.tel || null,
            adresse: clientDetail.adresse || '',
            cin: clientDetail.cin || '',
            uuid: clientDetail.uuid
          });
          console.log('Form value',this.clientForm.value)
        },

        error: (error) => {
          console.error('Erreur lors du chargement des données:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      console.error('Client invalide ou manquant');
    }
  }

  saveChanges(): void {
    if (this.clientForm.invalid) {
      console.error('Le formulaire contient des erreurs');
      return;
    }

    const clientData = this.clientForm.value;
    if (!clientData.uuid) {
      console.error('UUID manquant, impossible de mettre à jour');
      return;
    }

    this.isSubmitting = true;

    this.clientService.updateClient(clientData.uuid, clientData).subscribe({
      next: (updatedClient) => {
        console.log('Client mis à jour avec succès', updatedClient);
        this.bsModalRef.hide();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du client', error);
        this.isSubmitting = false; // Assurez-vous que cette ligne est présente
      },
      complete: () => {
        this.isSubmitting = false; // Remis à false après la requête
      }
    });
  }

}
