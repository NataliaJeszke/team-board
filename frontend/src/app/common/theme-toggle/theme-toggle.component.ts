import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { ThemeService } from '../../core/services/theme/theme.service';

@Component({
  selector: 'common-theme-toggle',
  imports: [ButtonModule, TooltipModule, ToggleSwitch, FormsModule, CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.styles.scss',
})
export class ThemeToggleComponent {
    private themeService = inject(ThemeService);

    get isDarkMode() {
        return this.themeService.isDarkMode();
      }
    
      set isDarkMode(value: boolean) {
        this.themeService.setDarkMode(value);
      }
}