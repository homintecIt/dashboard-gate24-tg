import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VoiesService } from '../../services/voies.service';
import { SitesService } from '../../services/sites.service';

@Component({
  selector: 'app-voies-edit-modal',
  templateUrl: './voies-edit-modal.component.html',
  styleUrls: ['./voies-edit-modal.component.css']
})
export class VoiesEditModalComponent {
  editForm!: FormGroup;
  data: any;
  loading = false;
  isSubmitting = false;
  sites: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private voiesService: VoiesService,
    private sitesService: SitesService
  ) {}

  ngOnInit(): void {
    // Load sites for dropdown
    this.sitesService.loadSites().subscribe(
      sites => this.sites = sites
    );

    this.editForm = this.fb.group({
      nom: [this.data.nom, Validators.required],
      ip: [this.data.ip, Validators.required],
      site_id: [this.data.site?.id, Validators.required],
      id: this.data.id
    });
  }

  onSubmit(): void {
    if (this.editForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const updateData = this.editForm.value;

      this.voiesService.updateVoieData(updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.bsModalRef.hide();
          this.voiesService.refreshVoies().subscribe();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}
