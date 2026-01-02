import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';

import { ThemeService } from '@core/services/theme/theme.service';

@Component({
  selector: 'tb-common-theme-toggle',
  imports: [CommonModule, TooltipModule, TranslateModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.style.scss'],
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  isDarkMode = () => this.themeService.isDarkMode();

  toggleTheme(): void {
    const currentMode = this.isDarkMode();
    this.themeService.setDarkMode(!currentMode);
  }
}
