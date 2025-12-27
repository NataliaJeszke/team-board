import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-mode';
  private readonly DARK_CLASS = 'app-dark';
  
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
    
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(current => !current);
    localStorage.setItem(this.STORAGE_KEY, this.isDarkMode() ? 'dark' : 'light');
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  listenToSystemPreferences(): void {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.isDarkMode.set(e.matches);
        }
      });
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
  }

  private applyTheme(isDark: boolean): void {
    const htmlElement = document.documentElement;
    
    if (isDark) {
      htmlElement.classList.add(this.DARK_CLASS);
    } else {
      htmlElement.classList.remove(this.DARK_CLASS);
    }
  }
}