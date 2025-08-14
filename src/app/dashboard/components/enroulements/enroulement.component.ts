import { Component, OnInit } from '@angular/core';
import { Statistic } from 'src/app/models/statistic.model';
import { StatisticService } from '../services/statistic.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { SearchListComponent } from './search-list/search-list.component';
import { RechercheModalComponent } from './recherche-modal/recherche-modal.component';

@Component({
  selector: 'app-enroulement',
  templateUrl: './enroulement.component.html',
  styleUrls: ['./enroulement.component.css'],
})
export class EnroulementComponent implements OnInit {
  d = new Date();
  year = this.d.getFullYear();
  statistics!: Statistic;
  loading = false;
  error: string | null = null;
  constructor(private statisticService: StatisticService,
    private modalService: BootstrapModalService,

  ) {}

  ngOnInit(): void {

    this.getStatitics(this.year);
  }

  getStatitics(yearParam: number) {
    this.statisticService.getStatistics(yearParam).subscribe({
      next: (data: any) => {
        this.statistics = data;
      },
    });
  }

    searchChoice() {
    this.modalService.openModal(SearchListComponent, '', 'modal-md modal-dialog-centered');
  }


   showCompte() {
  this.modalService.openModal(RechercheModalComponent, "accountNumber", 'modal-md modal-dialog-centered');

  }

   showTag() {
  this.modalService.openModal(RechercheModalComponent, "tagCode", 'modal-md modal-dialog-centered');

  }


    rechargeCompte() {
  this.modalService.openModal(SearchListComponent, "", 'modal-md modal-dialog-centered');

  }

  onSearch(event: any): void {

    if (event.target.value.length == 4) {
      this.loading = true;
      this.year = event.target.value;
      this.statisticService.getStatisticByYear(this.year).subscribe({
        next: (data: any) => {
          this.statistics = data;
          this.error = null
          this.loading = false;
        },
        error: (err) => {
          this.loading = !this.loading;
          console.error('Erreur de chargement', err);
          this.error = 'Impossible de charger les données. verifiez l\'année';
        },
      });
    }
  }

  // onSearch(yearCible:number){
  //   if (yearCible === this.year) return;
  //   this.year = yearCible
  //   this.getStatitics(this.year)
  // }
}
