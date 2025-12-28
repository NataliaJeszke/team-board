import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

import { Language, User } from '@core/models';
import { setLanguage } from '@core/language/store/language.actions';
import { selectCurrentLanguage } from '@core/language/store/language.selectors';

import { ThemeToggleComponent } from '@common/components/theme-toggle/theme-toggle.component';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@core/constants';

@Component({
  selector: 'tb-header',
  imports: [ButtonModule, MenuModule, ThemeToggleComponent, TranslateModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private router = inject(Router);
  private languageStore = inject(Store);
  private translate = inject(TranslateService);

  user_ = input<User>();

  currentLanguage = signal<Language>(DEFAULT_LANGUAGE);

  constructor() {
    this.languageStore.select(selectCurrentLanguage).subscribe(lang => {
      this.currentLanguage.set(lang);
    });
  }

  menuItems = computed<MenuItem[]>(() => {
    const currentLang = this.currentLanguage();

    return [
      {
        label: this.translate.instant('common.components.header.menu.language.title'),
        icon: 'pi pi-globe',
        items: [
          {
            label: this.translate.instant('common.components.header.menu.language.polish'),
            badge: currentLang === LANGUAGES.PL ? '✓' : '',
            command: () => this.changeLanguage(LANGUAGES.PL),
          },
          {
            label: this.translate.instant('common.components.header.menu.language.english'),
            badge: currentLang === LANGUAGES.EN ? '✓' : '',
            command: () => this.changeLanguage(LANGUAGES.EN),
          },
        ],
      },
      {
        separator: true,
      },
      {
        label: this.translate.instant('common.components.header.menu.logout'),
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
        styleClass: 'text-red-500',
      },
    ];
  });

  changeLanguage(lang: Language) {
    this.languageStore.dispatch(setLanguage({ lang }));
  }

  logout(): void {
    console.log('Wylogowanie...');
    this.router.navigate(['/login']);
  }
}
