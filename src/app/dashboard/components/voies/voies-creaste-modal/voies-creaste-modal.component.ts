import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VoiesService } from '../../services/voies.service';
import { SitesService } from '../../services/sites.service';

@Component({
  selector: 'app-voies-creaste-modal',
  templateUrl: './voies-creaste-modal.component.html',
  styleUrls: ['./voies-creaste-modal.component.css']
})
export class VoiesCreasteModalComponent {
  voieForm: FormGroup;
  sites: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private voiesService: VoiesService,
    private sitesService: SitesService
  ) {
    this.voieForm = this.fb.group({
      nom: ['', Validators.required],
      ip: ['', Validators.required],
      site_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Load sites for dropdown
    this.sitesService.loadSites().subscribe(
      sites => this.sites = sites
    );
  }

  onSubmit() {
    if (this.voieForm.valid) {
      this.voiesService.createVoie(this.voieForm.value).subscribe({
        next: () => {
          this.activeModal.close('Voie ajoutée');
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de la voie', err);
        }
      });
    }
  }
}
