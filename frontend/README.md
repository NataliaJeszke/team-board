# Team Board - Frontend Application

A modern, production-grade Angular 21 application for team collaboration and task management, built with state management patterns.

- **Frontend** - Task Board Application with Angular 21
- **Backend** - Task Board Backend with NestJS
( Both are creating monorepo. Backend is to download from: https://github.com/NataliaJeszke/team-board-backend )

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [State Management (NgRx)](#-state-management-ngrx)
- [Angular Signals](#-angular-signals)
- [Routing & Guards](#-routing--guards)
- [Internationalization (i18n)](#-internationalization-i18n)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development Guidelines](#-development-guidelines)

## 🎯 Project Overview

Team Board is a collaborative task management application designed to help teams organize work, track progress, and manage tasks efficiently. The application provides a comprehensive interface for team members to create, assign, and monitor tasks across different projects.

### Key Features

- **Task Management**: Create, edit, and organize tasks with detailed information
- **User Management**: User authentication, registration, and profile management
- **Real-time Updates**: State synchronization across the application
- **Multi-language Support**: Full internationalization with Polish and English languages
- **Responsive Design**: Modern UI that works across all devices
- **Role-based Access**: Protected routes and authenticated workflows

### Target Use Case

This application is designed for small to medium-sized development teams who need a lightweight, fast, and reliable task management solution with a focus on user experience and modern frontend practices.

## 🛠 Tech Stack

### Core Framework
- **Angular 21.0.6** - Latest version with standalone components and modern reactive patterns
- **TypeScript 5.9.3** - Type-safe development with latest language features
- **RxJS 7.8** - Reactive programming and asynchronous data streams

### State Management
- **NgRx Store 21.0.1** - Centralized state management with Redux pattern
- **NgRx Effects 21.0.1** - Side effect management for async operations
- **NgRx Store DevTools 21.0.1** - Time-travel debugging and state inspection
- **Angular Signals** - Fine-grained reactivity for component state

### UI & Styling
- **PrimeNG 21.0.2** - Enterprise-grade UI component library
- **PrimeIcons 7.0.0** - Icon set for consistent visual language
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **@primeuix/themes 2.0.2** - Theming system for PrimeNG components

### Internationalization
- **@ngx-translate/core 17.0.0** - Translation framework
- **@ngx-translate/http-loader 17.0.0** - Dynamic translation loading

### Development Tools
- **ESLint 9.39.1** - Code quality and consistency
- **Prettier 3.7.4** - Code formatting
- **Husky 9.1.7** - Git hooks for pre-commit validation
- **lint-staged 16.2.7** - Run linters on staged files

## 🏗 Architecture

### High-Level Architecture

The application follows a **feature-based modular architecture** with clear separation of concerns:

```
src/app/
├── core/              # Singleton services, guards, interceptors
│   ├── api/          # API services and models
│   ├── auth/         # Authentication (facade, store, guards)
│   └── language/     # Language management
├── feature/          # Feature modules (lazy-loaded when needed)
│   ├── tasks/        # Task management feature
│   └── users-dictionary/  # User management
├── view/             # Smart components (pages)
│   ├── board/        # Main board view
│   ├── login/        # Login page
│   └── register/     # Registration page
└── common/           # Shared components, utilities
```

### Architectural Patterns

#### 1. **Feature-Based Structure**
Each feature is self-contained with its own:
- NgRx store (state, actions, reducers, effects, selectors)
- Facade service (API for components)
- API services
- Models and types

#### 2. **Smart/Dumb Component Pattern**
- **Smart Components** (in `view/`): Connect to store, handle business logic, located in view directory
- **Dumb Components** (in `common/`): Pure presentation, receive data via `@Input()`, emit events via `@Output()`

#### 3. **Facade Pattern**
Every feature exposes a **Facade** that:
- Hides NgRx complexity from components
- Provides a simple API for reading state (via Signals)
- Provides methods for dispatching actions
- Makes components easier to test and refactor

Example:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  // Expose state as Signals
  readonly user = this.store.selectSignal(selectCurrentUser);
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly loading = this.store.selectSignal(selectAuthLoading);

  // Simple methods for actions
  login(credentials: LoginRequest) {
    this.store.dispatch(AuthActions.login({ credentials }));
  }
}
```

#### 4. **Standalone Components**
All components are **standalone** (no NgModules), following Angular's modern architecture:
- Explicit imports in component metadata
- Tree-shakable and optimized bundles
- Simplified testing setup

## 🔄 State Management (NgRx)

### Store Structure

```typescript
AppState {
  auth: AuthState {
    user: User | null
    token: string | null
    loading: boolean
    error: string | null
    initialized: boolean
  }
  tasks: TasksState {
    tasks: Task[]
    loading: boolean
    error: string | null
  }
  language: LanguageState {
    currentLanguage: 'pl' | 'en'
  }
}
```

### NgRx Flow: API → UI

1. **Component calls Facade method**
   ```typescript
   authFacade.login({ email, password })
   ```

2. **Facade dispatches Action**
   ```typescript
   store.dispatch(AuthActions.login({ credentials }))
   ```

3. **Effect intercepts Action**
   ```typescript
   @Effect()
   login$ = this.actions$.pipe(
     ofType(AuthActions.login),
     switchMap(({ credentials }) =>
       this.authApi.login(credentials).pipe(
         map(response => AuthActions.loginSuccess(response)),
         catchError(error => of(AuthActions.loginFailure({ error })))
       )
     )
   )
   ```

4. **Reducer updates State**
   ```typescript
   on(AuthActions.loginSuccess, (state, { user, token }) => ({
     ...state,
     user,
     token,
     loading: false,
     error: null
   }))
   ```

5. **Selector derives data**
   ```typescript
   export const selectIsAuthenticated = createSelector(
     selectAuthState,
     state => !!state.token && !!state.user
   )
   ```

6. **Facade exposes as Signal**
   ```typescript
   readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated)
   ```

7. **Component reads Signal**
   ```typescript
   @if (authFacade.isAuthenticated()) {
     <app-dashboard />
   }
   ```

### Benefits of This Approach

- **Unidirectional data flow** - Predictable state changes
- **Centralized state** - Single source of truth
- **Time-travel debugging** - Redux DevTools support
- **Testability** - Each layer can be tested in isolation
- **Type safety** - End-to-end TypeScript coverage

## ⚡ Angular Signals

### Why Signals?

Angular Signals provide **fine-grained reactivity** with several advantages:

1. **Performance** - No Zone.js overhead, direct reactivity
2. **Simplicity** - Synchronous, predictable value access
3. **Type Safety** - Full TypeScript inference
4. **Composability** - Easily derive computed values

### Best Practices Applied

1. **Read-only exposure** - Facades expose signals as `readonly` to prevent external mutation
2. **Computed values** - Use `computed()` for derived state
3. **Effect for side effects** - Use `effect()` for reactive side effects
4. **Signal inputs** - Use signal-based `@Input()` for better change detection

### Signals vs Observables

| Aspect | Signals | Observables |
|--------|---------|-------------|
| **Access** | Synchronous `.value()` | Async `subscribe()` |
| **Change Detection** | Automatic, fine-grained | Zone.js or manual |
| **Composition** | `computed()` | RxJS operators |
| **Use Case** | Local component state | Async operations, HTTP |

The app uses **both**: Observables for HTTP/async operations (NgRx Effects), Signals for component state (Facades).

## 🛣 Routing & Guards

### Route Structure

```typescript
routes: Routes = [
  { path: '', redirectTo: '/board', pathMatch: 'full' },
  {
    path: 'board',
    component: BoardComponent,
    canActivate: [authGuard]  // Protected route
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent }  // 404 handling
]
```

### Authentication Guard

The `authGuard` protects routes that require authentication:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  if (authFacade.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

### Route Protection Strategy

1. **Public routes**: `/login`, `/register`
2. **Protected routes**: `/board`, `/profile` (require authentication)
3. **404 handling**: Wildcard route `**` catches invalid URLs
4. **Return URL**: After login, user is redirected to originally requested page

## 🌍 Internationalization (i18n)

### Supported Languages

- **Polish (pl)** - Default language
- **English (en)** - Secondary language

### Translation Architecture

#### 1. **Translation Files**
```
src/assets/i18n/
├── pl.json    # Polish translations
└── en.json    # English translations
```

#### 2. **Translation Module Setup**

```typescript
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

provideHttpClient(),
importProvidersFrom(
  TranslateModule.forRoot({
    defaultLanguage: 'pl',
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })
)
```

#### 3. **Language Facade**

The `LanguageFacade` manages language state:

```typescript
@Injectable({ providedIn: 'root' })
export class LanguageFacade {
  readonly currentLanguage = this.store.selectSignal(selectCurrentLanguage);

  changeLanguage(language: 'pl' | 'en') {
    this.store.dispatch(LanguageActions.changeLanguage({ language }));
  }
}
```

#### 4. **Persistence**

Language preference is persisted in `localStorage`:

```typescript
@Effect()
changeLanguage$ = this.actions$.pipe(
  ofType(LanguageActions.changeLanguage),
  tap(({ language }) => {
    this.translate.use(language);
    localStorage.setItem('language', language);
  })
);
```

On app initialization, saved language is restored:

```typescript
@Effect()
initLanguage$ = this.actions$.pipe(
  ofType(LanguageActions.initLanguage),
  map(() => {
    const saved = localStorage.getItem('language') as 'pl' | 'en';
    return saved || 'pl';
  }),
  map(language => LanguageActions.changeLanguage({ language }))
);
```

### Usage in Templates

```html
<!-- Pipe syntax -->
<h1>{{ 'AUTH.LOGIN.TITLE' | translate }}</h1>

<!-- With parameters -->
<p>{{ 'WELCOME_MESSAGE' | translate: { name: user.name } }}</p>

<!-- In component -->
readonly title = this.translate.instant('AUTH.LOGIN.TITLE');
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.19.1 or higher (or 20.11.1+, 22.0.0+)
- **npm**: 9.0.0 or higher
- **Angular CLI**: 21.0.4 (will be installed with dependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd team-board/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (if needed)
   ```bash
   # Edit src/environments/environment.ts
   # Set API base URL and other configuration
   ```

### Running the Application

#### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload when you change source files.

#### Build for Production

```bash
npm run build
# or
ng build
```

Build artifacts will be stored in the `dist/` directory, optimized for production.

#### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

#### Code Formatting

```bash
# Format code with Prettier
npm run format

# Check if code is formatted
npm run format:check
```

### Environment Variables

The application uses Angular's environment files:

- `environment.ts` - Development configuration
- `environment.prod.ts` - Production configuration

Example configuration:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  version: '1.0.0'
};
```

## 🧪 Testing

### Unit Tests

This project uses **Jest** as the unit testing framework instead of the default Angular setup (Karma + Jasmine).

#### Why Jest?

- **Fast execution**  
  Jest runs tests in a Node.js environment without launching a browser, which results in significantly faster feedback during development and CI runs.

- **Excellent developer experience**  
  Clear error messages, readable diffs, and a powerful mocking API (`jest.fn()`, `jest.spyOn()`) make tests easier to write, understand, and maintain.

- **Well-suited for testing application logic**  
  Jest works particularly well for testing:
  - Angular components
  - services
  - utility logic  
  especially when combined with RxJS and dependency injection.

- **Popular choice in modern Angular projects**  
  Jest is widely adopted in Angular applications, particularly in projects using modern architectures and state management patterns.

#### Test Scope

Currently, unit tests cover:
- **components**
- **services**

NgRx **store logic (actions, reducers, effects, selectors)** is intentionally **not covered by unit tests** at this stage, as the current focus is on validating component behavior and service logic.

The testing setup can be extended in the future if deeper store-level test coverage becomes necessary.


## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Core singleton services
│   │   │   ├── api/                # API services layer
│   │   │   │   ├── config/         # API configuration
│   │   │   │   ├── models/         # API data models
│   │   │   │   └── services/       # HTTP services
│   │   │   ├── auth/               # Authentication module
│   │   │   │   ├── guards/         # Route guards
│   │   │   │   ├── store/          # NgRx store for auth
│   │   │   │   └── auth.facade.ts  # Auth facade
│   │   │   └── language/           # Language management
│   │   │       ├── store/          # NgRx store for language
│   │   │       └── language.facade.ts
│   │   ├── feature/                # Feature modules
│   │   │   ├── tasks/              # Task management
│   │   │   │   ├── store/          # NgRx store
│   │   │   │   └── tasks.facade.ts
│   │   │   └── users-dictionary/   # User dictionary
│   │   ├── view/                   # Smart components (pages)
│   │   │   ├── board/              # Main board view
│   │   │   ├── login/              # Login page
│   │   │   ├── register/           # Registration page
│   │   │   └── not-found/          # 404 page
│   │   ├── common/                 # Shared components
│   │   ├── app.component.ts        # Root component
│   │   ├── app.config.ts           # App configuration
│   │   └── app.routes.ts           # Route definitions
│   ├── assets/
│   │   └── i18n/                   # Translation files
│   │       ├── pl.json
│   │       └── en.json
│   ├── environments/               # Environment configs
│   └── styles.scss                 # Global styles
├── jest.config.ts                  # Jest configuration
├── setup-jest.ts                   # Jest setup file
├── tsconfig.json                   # TypeScript config
├── angular.json                    # Angular CLI config
└── package.json                    # Dependencies
```

## 📚 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Enforces code quality rules
- **Prettier**: Consistent code formatting
- **Naming conventions**:
  - Components: `feature-name.component.ts`
  - Services: `feature-name.service.ts`
  - Facades: `feature-name.facade.ts`
  - Models: `feature-name.model.ts`

### Git Workflow

Pre-commit hooks (via Husky) automatically:
1. Run Prettier on staged files
2. Run ESLint on TypeScript files
3. Ensure code quality before commit

### Component Development

1. **Create smart components** in `view/` for pages
2. **Create dumb components** in `common/` for reusable UI
3. **Use standalone components** (no NgModules)
4. **Inject facades**, not Store directly
5. **Use Signals** for local state
6. **Use Observables** for async operations

### State Management

1. **Create actions** with `createActionGroup()`
2. **Create reducers** with `createReducer()` and `on()`
3. **Create selectors** with `createSelector()`
4. **Create effects** with `@Effect()` decorator
5. **Expose via Facade** using `store.selectSignal()`

## 🏆 Key Technical Decisions

### Why NgRx?
- **Predictable state** management at scale
- **DevTools** for debugging
- **Testability** with clear separation
- **Performance** with memoized selectors

### Why Signals?
- **Better performance** than Zone.js change detection
- **Simpler mental model** than Observables for local state
- **Future-proof** - Angular's recommended approach

### Why Standalone Components?
- **Simpler** - no NgModule boilerplate
- **Tree-shakable** - smaller bundles
- **Future-proof** - Angular's direction
- **Easier testing** - explicit imports

### Why Facade Pattern?
- **Encapsulation** - hides NgRx complexity
- **Testability** - easier to mock
- **Maintainability** - single API surface
- **Migration safety** - can change implementation without breaking components