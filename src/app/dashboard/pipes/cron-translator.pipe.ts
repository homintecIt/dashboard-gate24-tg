import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cronTranslator'
})
export class CronTranslatorPipe implements PipeTransform {
  transform(cronExpression: string): string {
    if (!cronExpression) return 'Non défini';

    const cronMap = new Map<string, string>([
      ['* * * * * *', 'Chaque seconde'],
      ['*/5 * * * * *', 'Toutes les 5 secondes'],
      ['*/10 * * * * *', 'Toutes les 10 secondes'],
      ['*/30 * * * * *', 'Toutes les 30 secondes'],
      ['*/1 * * * *', 'Chaque minute'],
      ['0 */5 * * * *', 'Toutes les 5 minutes'],
      ['0 */10 * * * *', 'Toutes les 10 minutes'],
      ['0 */30 * * * *', 'Toutes les 30 minutes'],
      ['0 0-23/1 * * *', 'Chaque heure'],
      ['0 0-23/2 * * *', 'Toutes les 2 heures'],
      ['0 0-23/3 * * *', 'Toutes les 3 heures'],
      ['0 0-23/6 * * *', 'Toutes les 6 heures'],
      ['0 0-23/12 * * *', 'Toutes les 12 heures'],
      ['0 0 * * *', 'Chaque jour à minuit'],
      ['0 12 * * *', 'Chaque jour à midi'],
      ['0 0 * * 0', 'Chaque semaine'],
      ['0 0 * * 1-5', 'Chaque jour de la semaine'],
      ['0 0 * * 6,0', 'Chaque week-end'],
      ['0 0 1 * *', 'Premier jour du mois à minuit'],
      ['0 12 1 * *', 'Premier jour du mois à midi'],
      ['0 0 1 */2 *', 'Tous les 2 mois'],
      ['0 0 1 */3 *', 'Tous les trimestres'],
      ['0 0 1 */6 *', 'Tous les 6 mois'],
      ['0 0 1 0 *', 'Chaque année']
    ]);

    return cronMap.get(cronExpression) || 'Expression non reconnue';
  }
}
