import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FinancialService } from '../../services/financial.service';
import { Router } from '@angular/router';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';

@Component({
  selector: 'app-date-selection-modal',
  template: `
    <div class="modal-content text-center">
    <div class="modal-header">
    <h5 class="modal-title">Choisir la date</h5>
  </div>
    <div class="modal-body ">
      <input type="month" [(ngModel)]="selectedDate" class="form-control mb-3">
      <button class="btn btn-primary" (click)="confirmDate(selectedDate)">Valider</button>
    </div>
    </div>
  `
})
export class DateModalComponent {
  selectedDate!: string;

  constructor(
    private datafinancial: FinancialService,
    private router: Router,
    private modalService: BootstrapModalService // Injection du service modal
  ) {}

  ngOnInit(): void {
  }


  // Lorsqu'un site est sélectionné
  confirmDate(date: string): void {
    this.selectedDate = date;

    // Construire le payload
    const payload = {
      draw: 0,
      start: 0,
      length: 0,
      order: [''],
      columns: [''],
      search: {},
      dateStart: '',
      dateEnd: '',
      site: this.selectedDate, // Site sélectionné
      targCode: ''
    };

    // Naviguer vers la page avec les données
    this.router.navigate(['/dashboard/financial-data'], { queryParams: { date } });

    // Fermer le modal
    this.modalService.modalRef.hide(); // Ferme le modal via ngx-bootstrap
  }
}

