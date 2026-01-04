import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '@core/services/theme/theme.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeServiceMock: Partial<ThemeService>;

  beforeEach(async () => {
    const darkModeSignal = signal(false);

    themeServiceMock = {
      isDarkMode: darkModeSignal,
      setDarkMode: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('isDarkMode', () => {
    it('should return dark mode state from theme service', () => {
      expect(component.isDarkMode()).toBe(false);

      (themeServiceMock.isDarkMode!).set(true);
      expect(component.isDarkMode()).toBe(true);
    });
  });

  describe('toggleTheme', () => {
    it('should set dark mode to true when current mode is light', () => {
      (themeServiceMock.isDarkMode!).set(false);
      component.toggleTheme();
      expect(themeServiceMock.setDarkMode).toHaveBeenCalledWith(true);
    });

    it('should set dark mode to false when current mode is dark', () => {
      (themeServiceMock.isDarkMode!).set(true);
      component.toggleTheme();
      expect(themeServiceMock.setDarkMode).toHaveBeenCalledWith(false);
    });
  });
});