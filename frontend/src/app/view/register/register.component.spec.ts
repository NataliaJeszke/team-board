import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let store: MockStore;

  const initialState = {
    auth: {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    },
    tasks: {
      tasks: [],
      filteredTasks: [],
      loading: false,
      error: null,
      warning: null,
    },
    usersDictionary: {
      dictionary: [],
      loading: false,
      error: null,
    },
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn()
      },
      queryParams: {}
    },
    queryParams: of({}),
    params: of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});