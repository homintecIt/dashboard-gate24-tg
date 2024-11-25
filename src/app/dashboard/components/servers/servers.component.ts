import { Component, OnInit } from '@angular/core';
import { ServersService } from '../services/servers.service';
import Swal from 'sweetalert2';
import { swalAnimation } from 'src/app/misc/utilities.misc';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});
@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})

export class ServersComponent implements OnInit {
  servers: any[] = [];
  types: { type: string; status: boolean }[] = [];


  constructor(private serverService: ServersService) {}

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers() {
    this.serverService.getServer().subscribe((data) => {
      this.servers = data;
    });
  }


toggleStatus(server: any): void {
  const newEtat = server.etat === 'actif' ? 'inactif' : 'actif';
  swalWithBootstrapButtons.fire({
    title: 'Êtes-vous sûr ?',
    text: `Voulez-vous vraiment ${server.status ? 'désactiver' : 'activer'} le server du site ${server.site} ?`,
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
      this.serverService.updateServer(server.url, newEtat).subscribe(
        () => {
          server.etat = newEtat;
          this.loadServers();
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
