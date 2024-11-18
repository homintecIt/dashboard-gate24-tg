import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { ListeClientService } from 'src/app/models/listeClient.model';
@Component({
  selector: 'app-liste-des-clients',
  templateUrl: './liste-des-clients.component.html',
  styleUrls: ['./liste-des-clients.component.css']
})


export class ListeDesClientsComponent implements OnInit {
  data: ListeClientService[] = [];

  constructor(private ListeClientService: ListesClientService) {}

  ngOnInit(): void {
    this.ListeClientService.getAllClients().subscribe({
      next: (response) => {
        console.log(response)
        this.data = response.items;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données:', err);
      }
    });
  }
}
