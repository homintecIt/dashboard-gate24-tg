import { Component, Input, OnInit } from '@angular/core';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RechercheModalComponent } from '../recherche-modal/recherche-modal.component';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit {
    @Input() data: string = '';

  constructor(
    private modalService: BootstrapModalService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() { }

  openSearchModal(typeSearch: string) {
    this.closeModal();
    setTimeout(() => {
      this.modalService.openModal(RechercheModalComponent, typeSearch, 'modal-md modal-dialog-centered');
    }, 1000);
  }

  closeModal() {
    this.bsModalRef.hide();
  }
}
