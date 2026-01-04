import { signal, WritableSignal, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthFacade } from '@core/auth/auth.facade';
import { LanguageFacade } from '@core/language/language.facade';
import { Language, User } from '@core/models';
import { LANGUAGES } from '@core/language/constants/language.constants';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authFacadeLogoutMock: jest.Mock;
  let languageFacadeSetLanguageMock: jest.Mock;
  let translateInstantMock: jest.Mock;
  let translateGetMock: jest.Mock;
  let langChangeSubject: BehaviorSubject<LangChangeEvent>;
  let currentLanguageSignal: WritableSignal<Language>;

  const mockUser: User = {
    id: 1,
    name: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    authFacadeLogoutMock = jest.fn();
    languageFacadeSetLanguageMock = jest.fn();
    translateInstantMock = jest.fn((key: string) => key);
    translateGetMock = jest.fn((key: string) => of(key));
    
    currentLanguageSignal = signal<Language>(LANGUAGES.PL);
    
    langChangeSubject = new BehaviorSubject<LangChangeEvent>({
      lang: LANGUAGES.PL,
      translations: {},
    });
    
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, ],
      schemas: [NO_ERRORS_SCHEMA],
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
        {
          provide: TranslateService,
          useValue: {
            instant: translateInstantMock,
            get: translateGetMock,
            onLangChange: langChangeSubject.asObservable(),
          },
        },
      ],
    })
    .overrideComponent(HeaderComponent, {
      remove: { imports: [] },
      add: { imports: [MockTranslatePipe] }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('user_', mockUser);
    fixture.componentRef.setInput('taskCount_', 5);

    fixture.detectChanges();
  });

  afterEach(() => {
    langChangeSubject.complete();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
