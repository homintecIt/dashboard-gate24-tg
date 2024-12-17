import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { swalAnimation } from 'src/app/misc/utilities.misc';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { ServersCreateModalComponent } from './servers-create-modal/servers-create-modal.component';
import { ServerService } from '../services/servers.service';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerEditModalComponent } from './server-edit-modal/server-edit-modal.component';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});
@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})

export class ServersComponent implements OnInit {
  serveurs: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private serverService: ServerService,
    private modalService: NgbModal,
    private modalServices: BootstrapModalService

  ) {}

  ngOnInit() {
    // Charger les serveurs
    this.serverService.loadServeurs().subscribe();

    // S'abonner aux changements de la liste des serveurs
    this.serverService.serveurs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(serveurs => {
        this.serveurs = serveurs;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddServeurModal() {
    const modalRef = this.modalService.open(ServersCreateModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        // Gérer le résultat après fermeture du modal
        if (result) {
          // Optionnel : afficher un toast de succès
          console.log(result);
        }
      },
      (reason) => {
        // Gérer le rejet du modal
        console.log('Modal dismissé');
      }
    );
  }


  toggleStatus(server: any,event: Event): void {
    // Empêcher le changement d'état par défaut
    event.preventDefault();
    const newEtat = server.etat === 'actif' ? 'inactif' : 'actif';
    swalWithBootstrapButtons.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment désactiver le serveur du site ${server.site} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#405189',
      cancelButtonColor: '#6c757d',
      allowOutsideClick: false,
      allowEscapeKey: false,
      reverseButtons: false,
      ...swalAnimation,
    }).then((result) => {
      if (result.isConfirmed) {
        // Si confirmé, mettre à jour le statut
        this.serverService.updateServer({...server, etat: newEtat}).subscribe(
          () => {
            server.etat = newEtat;
            this.serverService.loadServeurs().subscribe();
            Swal.fire('Succès', `Le statut a été mis à jour.`, 'success');
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du statut', error);
            Swal.fire('Erreur', 'La mise à jour a échoué.', 'error');
          }
        );
      }
      // Si annulé, rien ne change (le switch reste activé)
    });
  }


openDetailsModal(server: any): void {
  console.log('Ouverture des détails:', server  );
  this.modalServices.openModal(
    ServerEditModalComponent,
    server,
    'modal-lg'
  );
  // const modalRef = this.modalService.open(ServerEditModalComponent, {
  //   size: 'lg',
  //   backdrop: 'static'
  // });

  // modalRef.result.then(
  //   (result) => {
  //     // Gérer le résultat après fermeture du modal
  //     if (result) {
  //       // Optionnel : afficher un toast de succès
  //       console.log(result);
  //     }
  //   },
  //   (reason) => {
  //     // Gérer le rejet du modal
  //     console.log('Modal dismissé');
  //   }
  // );
}

}
