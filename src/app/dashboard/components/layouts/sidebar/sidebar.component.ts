import { Component } from '@angular/core';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { PassagesDropdownSiteComponent } from '../../passages/passages-dropdown-site/passages-dropdown-site.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(
    private modalService: BootstrapModalService,  ) {}


    openPassagesModal(): void {
      this.modalService.openModal(PassagesDropdownSiteComponent,"",'modal-md');
    }
}
