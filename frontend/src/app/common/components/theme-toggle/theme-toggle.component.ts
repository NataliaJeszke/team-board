import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { ThemeService } from '@core/services/theme/theme.service';
import { toggleSwitchStyles } from './theme-toggle.component.styles';

@Component({
  selector: 'tb-common-theme-toggle',
  imports: [ButtonModule, TooltipModule, ToggleSwitch, FormsModule, CommonModule],
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly toggleSwitchDt = toggleSwitchStyles

  isDarkMode = () => this.themeService.isDarkMode();
  
  toggleTheme = (value: boolean) => this.themeService.setDarkMode(value);
}