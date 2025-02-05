// src/app/dashboard/components/sites/sites.component.ts
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { swalAnimation } from 'src/app/misc/utilities.misc';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SitesCreateModalComponent } from './sites-create-modal/sites-create-modal.component';
import { SitesEditModalComponent } from './sites-edit-modal/sites-edit-modal.component';
import { SitesService } from '../services/sites.service';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {
  sites: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private sitesService: SitesService,
    private modalService: NgbModal,
    private modalServices: BootstrapModalService
  ) {}

  ngOnInit() {
    // Load sites
    this.sitesService.loadSites().subscribe();

    // Subscribe to sites list changes
    this.sitesService.sites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sites => {
        this.sites = sites;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddSiteModal() {
    const modalRef = this.modalService.open(SitesCreateModalComponent, {
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
      SitesEditModalComponent,
      site,
      'modal-lg'
    );
  }
}
