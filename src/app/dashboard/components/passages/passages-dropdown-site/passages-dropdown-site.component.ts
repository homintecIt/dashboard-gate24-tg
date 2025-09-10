import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PassageService } from '../../services/passage.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';

@Component({
  selector: 'app-passages-dropdown-site',
  templateUrl: './passages-dropdown-site.component.html',
  styleUrls: ['./passages-dropdown-site.component.css']
})
export class PassagesDropdownSiteComponent implements OnInit {
  @Input() data: any; // Données injectées dans le modal
  sites: string[] = []; // Liste des sites
  selectedSite: string = '';
  constructor(
    private passageService: PassageService,
    private router: Router,
    private modalService: BootstrapModalService // Injection du service modal
  ) {}

  ngOnInit(): void {
    this.fetchSites();
  }

  // Chargement des sites
  fetchSites(): void {
    this.passageService.getSites().subscribe({
      next: (sites) => {
        this.sites = sites.map((site) => site.passages_site);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sites : ', err);
      }
    });
  }

  // Lorsqu'un site est sélectionné
  onSiteSelected(site: string): void {
    this.selectedSite = site;

    // Construire le payload
    const payload = {
      draw: 0,
      start: 0,
      length: 0,
      order: [''],
      columns: [''],
      search: {},
      dateStart: '',
      dateEnd: '',
      site: site, // Site sélectionné
      targCode: ''
    };

    // Naviguer vers la page avec les données
    this.router.navigate(['/dashboard/passage-daily'], { queryParams: { site } });

    // Fermer le modal
    this.modalService.modalRef.hide(); // Ferme le modal via ngx-bootstrap
  }
}
