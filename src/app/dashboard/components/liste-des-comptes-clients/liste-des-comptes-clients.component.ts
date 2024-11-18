import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { AccountList, ListeClientService } from 'src/app/models/listeClient.model';

@Component({
  selector: 'app-liste-des-comptes-clients',
  templateUrl: './liste-des-comptes-clients.component.html',
  styleUrls: ['./liste-des-comptes-clients.component.css']
})
export class ListeDesComptesClientsComponent {

  data: AccountList[] = [];

  constructor(private Accounts: ListesClientService) {}

  ngOnInit(): void {
    this.Accounts.getAccounts().subscribe({
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
