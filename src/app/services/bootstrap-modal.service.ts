import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class BootstrapModalService {
  modalRef!: BsModalRef;

  constructor(private modalService: BsModalService) { }

  openModal(component: any, data?: any, modalClass?: string, ignoreBackdrop?: boolean ) {
    const config = {
      ignoreBackdropClick: ignoreBackdrop ? ignoreBackdrop : false,
      initialState: {
        data
      },
      class: modalClass ? `${modalClass}` : 'modal-lg'
    };

   return this.modalRef = this.modalService.show(component, config);
  }
}
