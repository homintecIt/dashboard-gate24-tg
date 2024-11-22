import { Component, OnInit } from '@angular/core';
import { TypeSynchroServiceService } from '../services/type-synchro-service.service';
import Swal from 'sweetalert2';
import { swalAnimation } from 'src/app/misc/utilities.misc';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});

@Component({
  selector: 'app-type-synchro',
  templateUrl: './type-synchro.component.html',
  styleUrls: ['./type-synchro.component.css']
})
export class TypeSynchroComponent implements OnInit {
  types: { type: string; status: boolean }[] = [];

  constructor(private typeSynchroService: TypeSynchroServiceService) {}

  ngOnInit(): void {
    this.fetchSynchroTypes();
  }

  fetchSynchroTypes(): void {
    this.typeSynchroService.getSynchroTypes().subscribe(
      (response: any) => {
        this.types = response.map((item: any) => ({
          type: item.type,
          status: item.status
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des types de synchro', error);
      }
    );
  }


toggleStatus(item: any): void {
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
}
