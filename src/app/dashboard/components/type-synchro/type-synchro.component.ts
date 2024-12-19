import { Component, OnInit } from '@angular/core';
import { TypeSynchroServiceService } from '../services/type-synchro-service.service';
import Swal from 'sweetalert2';
import { swalAnimation } from 'src/app/misc/utilities.misc';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { TypeSynchroEditComponent } from './type-synchro-edit/type-synchro-edit.component';
import { Subject } from 'rxjs';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});

@Component({
  selector: 'app-type-synchro',
  templateUrl: './type-synchro.component.html',
  styleUrls: ['./type-synchro.component.css']
})
export class TypeSynchroComponent implements OnInit {
  private destroy$ = new Subject<void>();

  types: {
time: string;id:number; type: string; status: boolean
}[] = [];

  constructor(private typeSynchroService: TypeSynchroServiceService,
    private modalServices: BootstrapModalService

  ) {}

  ngOnInit(): void {
    this.fetchSynchroTypes();
    this.loadData()
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

loadData(){
this.typeSynchroService.succesEvent.subscribe((data)=>{
  this.fetchSynchroTypes()
})
}

  fetchSynchroTypes(): void {
    this.typeSynchroService.getSynchroTypes().subscribe(
      (response: any) => {
        this.types = response.map((item: any) => ({
          id: item.id,
          type: item.type,
          status: item.status,
          time: item.time
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des types de synchro', error);
      }
    );
  }


toggleStatus(item: any,event: Event): void {
  // Empêcher le changement d'état par défaut
  event.preventDefault();
  swalWithBootstrapButtons.fire({
    title: 'Êtes-vous sûr ?',
    text: `Voulez-vous vraiment ${item.status ? 'désactiver' : 'activer'} le type "${item.type}" ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler',
    confirmButtonColor: ' #405189',
        cancelButtonColor: '#6c757d',
        allowOutsideClick: false,
        allowEscapeKey: false,
        reverseButtons: false,
        ...swalAnimation,
  }).then((result) => {
    if (result.isConfirmed) {
      const newStatus = !item.status;
      this.typeSynchroService.updateSynchroStatus(item.type, newStatus).subscribe(
        () => {
          item.status = newStatus;
          Swal.fire('Succès', `Le statut a été mis à jour.`, 'success');
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du statut', error);
          Swal.fire('Erreur', 'La mise à jour a échoué.', 'error');
        }
      );
    }
  });
}



openDetailsModal(server: any): void {
  console.log('Ouverture des détails:', server  );
  this.modalServices.openModal(
    TypeSynchroEditComponent,
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
