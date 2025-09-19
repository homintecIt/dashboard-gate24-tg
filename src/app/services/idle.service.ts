import { Injectable, NgZone } from '@angular/core';
import { storageHelper } from '../misc/storage.misc';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  private timeoutId: any;
  private readonly idleTime: number = 150 * 60 * 1000;

  constructor(private router: Router, private ngZone: NgZone) {
    this.startWatching();
  }

  startWatching(): void {
    this.resetTimer();

    ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event => {
      window.addEventListener(event, () => this.resetTimer());
    });
  }

  private resetTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => this.logout(), this.idleTime);
    });
  }

  private logout(): void {
    this.ngZone.run(() => {
      console.log('User is inactive for 15 minutes. Logging out...');
        storageHelper.local.clear();
        storageHelper.session.clear();
        this.router.navigateByUrl('/auth/signin');
    });
  }
}
