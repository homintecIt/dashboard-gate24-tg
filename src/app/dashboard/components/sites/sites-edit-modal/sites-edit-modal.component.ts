import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SitesService } from '../../services/sites.service';

@Component({
  selector: 'app-sites-edit-modal',
  templateUrl: './sites-edit-modal.component.html',
  styleUrls: ['./sites-edit-modal.component.css']
})
export class SitesEditModalComponent {
  editForm!: FormGroup;
  data: any;
  loading = false;
  isSubmitting = false;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private sitesService: SitesService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      nom: [this.data.nom, Validators.required],
      tarif: [this.data.tarif, [Validators.required, Validators.min(0)]],
      id: this.data.id
    });
  }

  onSubmit(): void {
    if (this.editForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const updateData = this.editForm.value;

      this.sitesService.updateSiteData(updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.bsModalRef.hide();
          this.sitesService.refreshSites().subscribe();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}
