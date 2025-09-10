import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { formatDate, formatDateList, locale } from './utilities.misc';
import { storageHelper } from './storage.misc';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable().pipe(delay(1));
  @Output() searchEvent = new EventEmitter<any>();

  constructor() { }

  onSearchTriggered(data: any) {
    this.searchEvent.emit(data);
  }

  get numberMaps(): any {
    let list = {
      "=1": "un élement",
      "=2": "deux éléments",
      "other": "# éléments"
    }
    let search = {
      "=0": "aucune correspondance trouvée",
      "=1": "une correspondance trouvée",
      "=2": "deux correspondances trouvées",
      "other": "# correspondances trouvées"
    }
    return { list, search }
  }

  get defaultDataLength(): number {
    return 10;
  }

  get dataLengthOptions(): number[] {
    return [5, 10, 20, 50, 100];
  }

  formatDate(date: string) {
    const lang = storageHelper.local.get(`${locale}`) ? 'fr' : 'enUs';
    return date.length !== 0 ? formatDate(date, lang) : "";
  }

  formatDateList(date: string) {
    const lang = storageHelper.local.get(`${locale}`) ? 'fr' : 'enUs';
    return date.length !== 0 ? formatDateList(date, lang) : "";
  }

  isMobile(): boolean {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  isTablet(): boolean {
    return /iPad|Tablet|PlayBook|Silk/i.test(navigator.userAgent);
  }

  isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet();
  }

  getPlatformType(): string {
    if (this.isMobile()) {
      return 'mobile';
    } else if (this.isTablet()) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

}
