import { Component } from '@angular/core';
import { VoiesService } from '../services/voies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { Subject, takeUntil } from 'rxjs';
import { VoiesCreasteModalComponent } from './voies-creaste-modal/voies-creaste-modal.component';
import { VoiesEditModalComponent } from './voies-edit-modal/voies-edit-modal.component';

@Component({
  selector: 'app-voies',
  templateUrl: './voies.component.html',
  styleUrls: ['./voies.component.css']
})
export class VoiesComponent {
voies: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private voiesService: VoiesService,
    private modalService: NgbModal,
    private modalServices: BootstrapModalService
  ) {}

  ngOnInit() {
    // Load voies
    this.voiesService.loadVoies().subscribe();

    // Subscribe to voies list changes
    this.voiesService.voies$
      .pipe(takeUntil(this.destroy$))
      .subscribe(voies => {
        this.voies = voies;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddVoieModal() {
    const modalRef = this.modalService.open(VoiesCreasteModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log(result);
        }
      },
      (reason) => {
        console.log('Modal dismissed');
      }
    );
  }

  openDetailsModal(site: any): void {
    this.modalServices.openModal(
      VoiesEditModalComponent,
      site,
      'modal-lg'
    );
  }
}
