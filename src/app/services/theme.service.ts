import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(this.getInitialTheme());
  
  constructor() {
    this.applyTheme(this.isDarkMode.value);
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  get darkMode$(): Observable<boolean> {
    return this.isDarkMode.asObservable();
  }

  get isDarkModeEnabled(): boolean {
    return this.isDarkMode.value;
  }

  toggleTheme(): void {
    const newMode = !this.isDarkMode.value;
    this.isDarkMode.next(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    this.applyTheme(newMode);
  }

  setTheme(isDark: boolean): void {
    this.isDarkMode.next(isDark);
    localStorage.setItem('darkMode', isDark.toString());
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
