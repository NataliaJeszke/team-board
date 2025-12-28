import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { User } from '@core/models';

import { ThemeToggleComponent } from '@common/components/theme-toggle/theme-toggle.component';


@Component({
  selector: 'app-header',
  imports: [ButtonModule, MenuModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private router = inject(Router);

  user_ = input<User>();
  currentLanguage = signal<'PL' | 'EN'>('PL');

  menuItems: MenuItem[] = [
    {
      label: 'Język / Language',
      icon: 'pi pi-globe',
      items: [
        {
          label: 'Polski',
          icon: 'pi pi-check',
          badge: this.currentLanguage() === 'PL' ? '✓' : '',
          command: () => this.changeLanguage('PL'),
        },
        {
          label: 'English',
          icon: 'pi pi-check',
          badge: this.currentLanguage() === 'EN' ? '✓' : '',
          command: () => this.changeLanguage('EN'),
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
  ];

  changeLanguage(lang: 'PL' | 'EN'): void {
    this.currentLanguage.set(lang);
    console.log('Zmiana języka na:', lang);

    this.updateLanguageBadges();
  }

  private updateLanguageBadges(): void {
    const languageItem = this.menuItems.find(item => item.label === 'Język / Language');
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
