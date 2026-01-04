import { signal, WritableSignal} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MenuItem } from 'primeng/api';

import { HeaderComponent } from './header.component';
import { AuthFacade } from '@core/auth/auth.facade';
import { LanguageFacade } from '@core/language/language.facade';
import { Language, User } from '@core/models';
import { LANGUAGES } from '@core/language/constants/language.constants';

// Custom loader for tests
class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authFacadeLogoutMock: jest.Mock;
  let languageFacadeSetLanguageMock: jest.Mock;
  let currentLanguageSignal: WritableSignal<Language>;

  const mockUser: User = {
    id: 1,
    name: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    authFacadeLogoutMock = jest.fn();
    languageFacadeSetLanguageMock = jest.fn();
    
    currentLanguageSignal = signal<Language>(LANGUAGES.PL);
    
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ],
      providers: [
        {
          provide: AuthFacade,
          useValue: {
            logout: authFacadeLogoutMock,
          },
        },
        {
          provide: LanguageFacade,
          useValue: {
            currentLanguage: currentLanguageSignal,
            setLanguage: languageFacadeSetLanguageMock,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('user_', mockUser);
    fixture.componentRef.setInput('taskCount_', 5);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have user input set correctly', () => {
    expect(component.user_()).toEqual(mockUser);
  });

  it('should have taskCount input set correctly', () => {
    expect(component.taskCount_()).toBe(5);
  });

  it('should have default taskCount of 0 when not provided', () => {
    const newFixture = TestBed.createComponent(HeaderComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.componentRef.setInput('user_', mockUser);
    newFixture.detectChanges();
    
    expect(newComponent.taskCount_()).toBe(0);
  });

  it('should emit addTaskClick when onAddTask is called', () => {
    const emitSpy = jest.fn();
    component.addTaskClick.subscribe(emitSpy);

    component.onAddTask();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should have current language from LanguageFacade', () => {
    expect(component.currentLanguage()).toBe(LANGUAGES.PL);
  });

  it('should build user menu items with correct structure', () => {
    const menuItems = component.userMenuItems();

    expect(menuItems.length).toBe(3);
    expect(menuItems[0].items?.length).toBe(2);
    expect(menuItems[1].separator).toBe(true);
    expect(menuItems[2].items?.length).toBe(1);
  });

  it('should mark current language in menu items', () => {
    currentLanguageSignal.set(LANGUAGES.PL);
    fixture.detectChanges();

    const menuItems = component.userMenuItems();
    const languageItems = menuItems[0].items as MenuItem[];

    expect(languageItems[0].icon).toBe('pi pi-check');
    expect(languageItems[1].icon).toBeUndefined();
  });

  it('should update menu when language changes', () => {
    currentLanguageSignal.set(LANGUAGES.EN);
    fixture.detectChanges();

    const menuItems = component.userMenuItems();
    const languageItems = menuItems[0].items as MenuItem[];

    expect(languageItems[0].icon).toBeUndefined();
    expect(languageItems[1].icon).toBe('pi pi-check');
  });

  it('should call setLanguage when Polish menu item is clicked', () => {
    const menuItems = component.userMenuItems();
    const languageItems = menuItems[0].items as MenuItem[];
    const polishMenuItem = languageItems[0];

    if (polishMenuItem.command) {
      polishMenuItem.command({ originalEvent: new Event('click'), item: polishMenuItem });
    }

    expect(languageFacadeSetLanguageMock).toHaveBeenCalledWith(LANGUAGES.PL);
  });

  it('should call setLanguage when English menu item is clicked', () => {
    const menuItems = component.userMenuItems();
    const languageItems = menuItems[0].items as MenuItem[];
    const englishMenuItem = languageItems[1];

    if (englishMenuItem.command) {
      englishMenuItem.command({ originalEvent: new Event('click'), item: englishMenuItem });
    }

    expect(languageFacadeSetLanguageMock).toHaveBeenCalledWith(LANGUAGES.EN);
  });

  it('should call logout when logout menu item is clicked', () => {
    const menuItems = component.userMenuItems();
    const logoutItems = menuItems[2].items as MenuItem[];
    const logoutMenuItem = logoutItems[0];

    if (logoutMenuItem.command) {
      logoutMenuItem.command({ originalEvent: new Event('click'), item: logoutMenuItem });
    }

    expect(authFacadeLogoutMock).toHaveBeenCalled();
  });

  it('should have getInitialsFromName utility function', () => {
    expect(component.getInitialsFromName).toBeDefined();
    expect(typeof component.getInitialsFromName).toBe('function');
  });

  it('should have default button tooltip message', () => {
    expect(component.defaultButtonTooltipMessage).toBeDefined();
  });

  it('should have default button aria label message', () => {
    expect(component.defaultButtonAriaLabelMessage).toBeDefined();
  });
});