import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

import { User } from '@core/models';
import { setLanguage } from '@core/language/store/language.actions';

import { ThemeToggleComponent } from '@common/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'tb-header',
  imports: [ButtonModule, MenuModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private router = inject(Router);
  private languageStore = inject(Store);

  user_ = input<User>();
  currentLanguage = signal<'PL' | 'EN'>('PL');

  menuItems = computed<MenuItem[]>(() => [
    {
      label: 'Język / Language',
      icon: 'pi pi-globe',
      items: [
        {
          label: 'Polski',
          icon: 'pi pi-check',
          badge: this.currentLanguage() === 'PL' ? '✓' : '',
          command: () => this.changeLanguage('pl'),
        },
        {
          label: 'English',
          icon: 'pi pi-check',
          badge: this.currentLanguage() === 'EN' ? '✓' : '',
          command: () => this.changeLanguage('en'),
        },
      ],
    },
    {
      separator: true,
    },
    {
      label: 'Wyloguj',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
      styleClass: 'text-red-500',
    },
  ]);

  changeLanguage(lang: 'pl' | 'en') {
    this.languageStore.dispatch(setLanguage({ lang }));
    
    this.currentLanguage.set(lang.toUpperCase() as 'PL' | 'EN');
    this.updateLanguageBadges();
  }

  private updateLanguageBadges(): void {
    const languageItem = this.menuItems().find(item => item.label === 'Język / Language');
    if (languageItem?.items) {
      languageItem.items.forEach(item => {
        if (item.label === 'Polski') {
          item.badge = this.currentLanguage() === 'PL' ? '✓' : '';
        }
        if (item.label === 'English') {
          item.badge = this.currentLanguage() === 'EN' ? '✓' : '';
        }
      });
    }
  }

  logout(): void {
    console.log('Wylogowanie...');
    this.router.navigate(['/login']);
  }
}