import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Store } from '@ngrx/store';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { Language, User } from '@core/models';

import { setLanguage } from '@core/language/store/language.actions';
import { selectCurrentLanguage } from '@core/language/store/language.selectors';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@core/language/constants/language.constants';

import { ThemeToggleComponent } from '@common/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'tb-header',
  imports: [
    ButtonModule,
    MenuModule,
    ThemeToggleComponent,
    TranslateModule,
    CommonModule,
    BadgeModule,
    TooltipModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.style.scss'],
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly languageStore = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly user_ = input<User>();
  readonly taskCount_ = input<number>(0);

  readonly currentLanguage = signal<Language>(DEFAULT_LANGUAGE);

  readonly userMenuItems = computed<MenuItem[]>(() =>
    this.buildUserMenuItems(this.currentLanguage())
  );

  constructor() {
    this.languageStore
      .select(selectCurrentLanguage)
      .pipe(takeUntilDestroyed())
      .subscribe(lang => {
        this.currentLanguage.set(lang);
      });
  }

  getInitials(user?: User): string {
    if (!user?.name) return '??';

    const names = user.name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }

    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  onTasksClick(): void {
    this.router.navigate(['/tasks']);
  }

  private buildUserMenuItems(currentLang: Language): MenuItem[] {
    return [
      {
        label: this.translate.instant('common.components.header.menu.language.title'),
        icon: 'pi pi-globe',
        items: [
          {
            label: this.translate.instant('common.components.header.menu.language.polish'),
            icon: currentLang === LANGUAGES.PL ? 'pi pi-check' : undefined,
            command: () => this.changeLanguage(LANGUAGES.PL),
          },
          {
            label: this.translate.instant('common.components.header.menu.language.english'),
            icon: currentLang === LANGUAGES.EN ? 'pi pi-check' : undefined,
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
      },
    ];
  }

  private changeLanguage(lang: Language): void {
    this.languageStore.dispatch(setLanguage({ lang }));
    this.cleanupOverlays();
  }

  private logout(): void {
    this.cleanupOverlays();
    this.router.navigate(['/login']);
  }

  private cleanupOverlays(): void {
    const overlays = document.querySelectorAll('.p-menu-overlay, .p-component-overlay');
    overlays.forEach(overlay => overlay.remove());
  }
}
