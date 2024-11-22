import { Component, OnInit } from '@angular/core';
import { PassageService } from '../../services/passage.service';

@Component({
  selector: 'app-passage-by-subscriber',
  templateUrl: './passage-by-subscriber.component.html',
  styleUrls: ['./passage-by-subscriber.component.css']
})
export class PassageBySubscriberComponent implements OnInit {
  data: any[] = [];
  noDataMessage: string = 'Aucune donnée disponible pour les abonnés.';

  constructor(private passageService: PassageService) {}

  ngOnInit(): void {
    this.loadSubscriberPassages();
  }

  loadSubscriberPassages(): void {
    this.passageService.getPassagesBySubscribers().subscribe(
      (response: any) => {
        this.data = response.records || [];
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
        this.data = [];
      }
    );
  }
}
