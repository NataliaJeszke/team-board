import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { cleanupOverlays, getInitialsFromName } from '@utils/index';

import { AuthFacade } from '@core/auth/auth.facade';
import { LanguageFacade } from '@core/language/language.facade';
import { Language, User } from '@core/models';
import { LANGUAGES } from '@core/language/constants/language.constants';

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
  private readonly authFacade = inject(AuthFacade);
  private readonly translate = inject(TranslateService);
  private readonly languageFacade = inject(LanguageFacade);

  readonly user_ = input<User>();
  readonly taskCount_ = input<number>(0);

  readonly addTaskClick = output<void>();

  readonly currentLanguage = this.languageFacade.currentLanguage;

  readonly userMenuItems = computed<MenuItem[]>(() =>
    this.buildUserMenuItems(this.currentLanguage())
  );

  readonly getInitialsFromName = getInitialsFromName;

  onAddTask(): void {
    this.addTaskClick.emit();
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
        items: [
          {
            label: this.translate.instant('common.components.header.menu.logout'),
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
    ];
  }

  private changeLanguage(lang: Language): void {
    this.languageFacade.setLanguage(lang);
    cleanupOverlays();
  }

  private logout(): void {
    cleanupOverlays();
    this.authFacade.logout();
  }
}
