import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SitesService } from '../../services/sites.service';

@Component({
  selector: 'app-sites-create-modal',
  templateUrl: './sites-create-modal.component.html',
  styleUrls: ['./sites-create-modal.component.css']
})
export class SitesCreateModalComponent {
  siteForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private sitesService: SitesService
  ) {
    this.siteForm = this.fb.group({
      nom: ['', Validators.required],
      tarif: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.siteForm.valid) {
      this.sitesService.createSite(this.siteForm.value).subscribe({
        next: () => {
          this.activeModal.close('Site ajouté');
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du site', err);
        }
      });
    }
  }
}
