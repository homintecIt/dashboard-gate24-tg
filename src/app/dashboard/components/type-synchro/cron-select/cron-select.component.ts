import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

interface CronOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-cron-select',
  templateUrl: './cron-select.component.html',
  styleUrls: ['./cron-select.component.css']
})
export class CronSelectComponent implements OnInit {
  @Input() selectedValue: string = '';
  @Output() cronSelected = new EventEmitter<string>();

  cronOptions: CronOption[] = [
    { label: 'Chaque seconde', value: '* * * * * *' },
    { label: 'Toutes les 5 secondes', value: '*/5 * * * * *' },
    { label: 'Toutes les 10 secondes', value: '*/10 * * * * *' },
    { label: 'Toutes les 30 secondes', value: '*/30 * * * * *' },
    { label: 'Chaque minute', value: '*/1 * * * *' },
    { label: 'Toutes les 5 minutes', value: '0 */5 * * * *' },
    { label: 'Toutes les 10 minutes', value: '0 */10 * * * *' },
    { label: 'Toutes les 30 minutes', value: '0 */30 * * * *' },
    { label: 'Chaque heure', value: '0 0-23/1 * * *' },
    { label: 'Toutes les 2 heures', value: '0 0-23/2 * * *' },
    { label: 'Toutes les 3 heures', value: '0 0-23/3 * * *' },
    { label: 'Toutes les 6 heures', value: '0 0-23/6 * * *' },
    { label: 'Toutes les 12 heures', value: '0 0-23/12 * * *' },
    { label: 'Chaque jour à minuit', value: '0 0 * * *' },
    { label: 'Chaque jour à midi', value: '0 12 * * *' },
    { label: 'Chaque semaine', value: '0 0 * * 0' },
    { label: 'Chaque jour de la semaine', value: '0 0 * * 1-5' },
    { label: 'Chaque week-end', value: '0 0 * * 6,0' },
    { label: 'Premier jour du mois à minuit', value: '0 0 1 * *' },
    { label: 'Premier jour du mois à midi', value: '0 12 1 * *' },
    { label: 'Tous les 2 mois', value: '0 0 1 */2 *' },
    { label: 'Tous les trimestres', value: '0 0 1 */3 *' },
    { label: 'Tous les 6 mois', value: '0 0 1 */6 *' },
    { label: 'Chaque année', value: '0 0 1 0 *' },
    { label: 'Toutes les 30 minutes entre 9h et 17h', value: '0 */30 9-17 * * *' },
    { label: 'Lundi au vendredi à 9h', value: '0 0 09 * * 1-5' },
    { label: 'Lundi au vendredi à midi', value: '0 0 12 * * 1-5' },
    { label: 'Lundi au vendredi à 17h', value: '0 0 17 * * 1-5' }
  ];

  constructor() {}

  ngOnInit(): void {}

  onCronSelect(event: any): void {
    this.cronSelected.emit(event.target.value);
  }
}
