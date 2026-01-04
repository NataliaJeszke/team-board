# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 21 task board application using NgRx for state management, PrimeNG for UI components, and Tailwind CSS for styling. This is a standalone component architecture (no NgModules) with centralized state management and i18n support (Polish/English).

## Development Commands

### Running the Application
```bash
npm start                    # Start dev server at http://localhost:4200
ng serve                     # Alternative to npm start
```

### Building
```bash
npm run build               # Production build (outputs to dist/)
npm run watch               # Development build with file watching
ng build                    # Direct Angular CLI build
```

### Testing
```bash
npm test                    # Run unit tests with Jest
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
npm run test:coverage:open  # Run tests with coverage and open report in browser
npm run test:ci             # Run tests in CI mode (with coverage, maxWorkers=2)
npm run test:karma          # Run legacy Karma tests (if needed)
```

### Linting & Formatting
```bash
npm run lint                # Run ESLint
npm run lint:fix            # Auto-fix ESLint issues
npm run format              # Format code with Prettier
npm run format:check        # Check formatting without changes
```

Pre-commit hooks via Husky automatically run lint-staged (Prettier + ESLint) on staged files.

### Code Generation
```bash
ng generate component <name>    # Generate component (uses SCSS by default)
ng generate service <name>       # Generate service
ng generate guard <name>         # Generate guard (uses . separator)
```

## Architecture Overview

### Directory Structure

```
src/app/
├── core/                   # Shared business logic, auth, API
│   ├── auth/              # Authentication (NgRx store, guards, services)
│   ├── language/          # i18n management (NgRx store, facade)
│   ├── models/            # Shared TypeScript interfaces
│   ├── api/               # HTTP services, interceptors, API models
│   └── services/          # Core services (ThemeService, etc.)
├── feature/               # Feature modules with NgRx stores
│   ├── tasks/            # Task management (CRUD, filters, facade)
│   └── users-dictionary/ # Users lookup (Signal-based)
├── common/                # Reusable components
│   └── components/       # Shared UI (task card, dialogs, filters, header)
├── view/                  # Page components (routed)
│   ├── board/            # Main dashboard
│   ├── login/            # Login page
│   └── register/         # Registration page
├── utils/                 # Utility functions
└── environments/          # Environment configs
```

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:
- `@core/*` → `src/app/core/*`
- `@feature/*` → `src/app/feature/*`
- `@common/*` → `src/app/common/*`
- `@view/*` → `src/app/view/*`
- `@utils/*` → `src/app/utils/*`

Always use these aliases when importing to avoid relative path issues.

### NgRx State Management

**Store Configuration** (`app.config.ts`):
```typescript
provideStore({
  auth: authReducer,
  language: languageReducer,
  tasks: tasksReducer
})
provideEffects([AuthEffects, LanguageEffects, TasksEffects])
```

**Feature Store Pattern** (used for auth, language, tasks):
1. **State** (`*.state.ts`): Interface + initial state
2. **Actions** (`*.actions.ts`): Action groups using `createActionGroup()`
3. **Reducer** (`*.reducer.ts`): Pure functions with `createReducer()` and `on()`
4. **Selectors** (`*.selectors.ts`): Memoized selectors via `createSelector()`
5. **Effects** (`*.effects.ts`): Side effects with `createEffect()`
6. **Facade** (`*.facade.ts`): Simplified API wrapping store dispatch/select

**Facade Pattern**: Every feature exposes a facade service that components use instead of directly accessing the store. Facades provide:
- Observable/Signal properties for state
- Methods that dispatch actions
- Simplified API that hides store complexity

Example:
```typescript
// Component uses facade, not store directly
readonly tasks = this.tasksFacade.tasks;           // Signal
readonly loading = this.tasksFacade.loading;       // Signal
this.tasksFacade.createTask(newTask);              // Method
```

### Modern Angular Patterns

This codebase uses Angular 15+ patterns:
- **Standalone components** (no NgModules)
- **`inject()` function** instead of constructor injection
- **`input()` and `output()`** for component inputs/outputs
- **Signals** for reactive state (`signal()`, `computed()`, `effect()`)
- **`selectSignal()`** to convert store selectors to signals

### Component Architecture

**Component Prefix**: `tb-` (team-board)

**Component Pattern**:
```typescript
@Component({
  selector: 'tb-example',
  standalone: true,
  imports: [CommonModule, TranslateModule, /* PrimeNG modules */],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent {
  private facade = inject(ExampleFacade);

  // Input/Output signals
  readonly data = input.required<DataType>();
  readonly onChange = output<ChangeType>();

  // Computed values
  readonly computedValue = computed(() => this.data().property);

  // Effects for side effects
  constructor() {
    effect(() => {
      // React to signal changes
    });
  }
}
```

### API Integration

**Configuration**:
- Base URL injected via `API_CONFIG` token (from `environment.apiBaseUrl`)
- Interceptors: `apiPrefixInterceptor` (adds base URL), `authInterceptor` (adds Bearer token)
- API endpoints centralized in `core/api/config/constants/api-endpoints.constants.ts`

**API Services** (`core/api/services/`):
- `AuthApiService`: login, register, getProfile
- `TaskApiService`: CRUD operations on tasks
- `UsersApiService`: Fetch user dictionary

**Flow**: Component → Facade → Action → Effect → API Service → Success/Failure Action → Reducer → State Update → Component

### Authentication Flow

1. **App Initialization**: `APP_INITIALIZER` runs `AuthInitService.initializeAuth()` before app starts
2. **Init Auth**: Dispatches `AuthActions.initAuth`
3. **Effect**: Checks localStorage for token/user, validates by fetching profile
4. **Success**: Sets `initialized: true` in auth state
5. **Auth Guard**: Routes check `selectAuthInitialized` and `selectIsAuthenticated`

**Token Storage**: `TokenStorageService` manages localStorage (token + user JSON)

### Styling Stack

**PrimeNG + PrimeUX v2**:
- UI components from PrimeNG 21.0.2
- Theme config in `src/theme.ts` (custom Blue theme based on Lara preset)
- Dark mode via `.app-dark` CSS class selector
- Configured in `app.config.ts`:
  ```typescript
  providePrimeNG({
    theme: { preset: MyBlueTheme, options: { darkModeSelector: '.app-dark' } },
    ripple: true,
    overlayAppendTo: 'body'
  })
  ```

**Tailwind CSS v4**:
- Configured with `@tailwindcss/postcss` plugin
- PostCSS config in `.postcssrc.json`
- Main styles in `src/styles.scss`:
  ```scss
  @use 'tailwindcss';
  @import 'primeicons/primeicons.css';
  ```

**SCSS**:
- Component-level styles use SCSS (configured in `angular.json`)
- Inline style language: `scss`

### i18n with ngx-translate

**Setup**:
- Translation files: `public/assets/i18n/pl.json` (Polish - default), `public/assets/i18n/en.json`
- Fallback language: Polish (`pl`)
- Language state managed in NgRx (`language` store)

**Usage**:
```html
<!-- Template -->
{{ 'common.components.header.menu.language.title' | translate }}

<!-- Component -->
this.translate.instant('key')
```

**Language Switching**:
- `LanguageFacade` exposes current language as signal
- Components use facade to dispatch language change actions
- Store updates and TranslateService is updated via effect

### Task Management

**State**: Tasks stored in NgRx with filters applied in selectors

**Permissions**:
- Only creator can edit/delete tasks
- Only assignee or creator can change status
- Computed properties in `TaskComponent` check permissions

**UI Services**:
- `TaskUiEventsService`: Subject-based event bus for task interactions
- `TaskUiService`: Maps status/priority to display labels/colors
- `TasksFiltersService`: Builds filter configuration

**Task Dialog**: Uses PrimeNG `DialogService` with `DynamicDialogComponent` for create/edit modals

## Adding New Features

### Adding a New NgRx Feature

1. Create feature directory in `src/app/feature/<feature-name>/`
2. Create store structure:
   ```
   feature-name/
   ├── store/
   │   ├── <feature>.state.ts
   │   ├── <feature>.actions.ts
   │   ├── <feature>.reducer.ts
   │   ├── <feature>.selectors.ts
   │   ├── <feature>.effects.ts
   │   └── index.ts
   ├── <feature>.facade.ts
   └── model/
   ```
3. Register reducer and effects in `app.config.ts`:
   ```typescript
   provideStore({ /* existing */, newFeature: newFeatureReducer })
   provideEffects([/* existing */, NewFeatureEffects])
   ```
4. Create facade exposing simplified API to components
5. Import feature models from `@core/models` or define feature-specific models

### Adding a New Component

1. Generate component:
   ```bash
   ng generate component <path>/<name>
   ```
2. Make it standalone (already default)
3. Import required modules (PrimeNG, TranslateModule, etc.)
4. Use `input()` and `output()` for data/events
5. Inject services with `inject()`
6. Use facade for state management
7. Add prefix `tb-` to selector

### Adding New API Endpoints

1. Define endpoint constant in `core/api/config/constants/api-endpoints.constants.ts`
2. Create/update API service in `core/api/services/`
3. Define request/response models in `core/api/models/`
4. Use service in effects for async operations

## Key Conventions

### Store Best Practices
- Keep state normalized (avoid deeply nested structures)
- Use selectors for all state access (never access state directly)
- Effects handle side effects only (API calls, navigation)
- Reducers must be pure functions (no side effects)
- Use facades as single source of truth for components

### Component Best Practices
- Use signals for reactive state (`signal()`, `computed()`, `effect()`)
- Prefer `effect()` over lifecycle hooks for side effects
- Keep components focused (single responsibility)
- Delegate business logic to services/facades
- Use PrimeNG `MessageService` for toast notifications

### Code Organization
- Features only import from `/core`, not from other features (avoid circular dependencies)
- Shared models go in `/core/models`
- Feature-specific models go in `feature/<name>/model`
- Constants in `/constants` folders within features
- Utilities in `/utils` for pure helper functions

### TypeScript
- Strict mode enabled
- Use interfaces for data models
- Readonly properties where applicable
- Avoid `any` type

### Testing with Jest
- **Test Framework**: Jest 30.x with `jest-preset-angular`
- **Spec files**: `*.spec.ts` naming, co-located with implementation
- **No NgModules**: Tests use standalone component imports
- **Mocking**: Manual mocks using Jest API (`jest.fn()`, `jest.spyOn()`)

**Files Excluded from Coverage** (configured in `jest.config.ts`):
- NgRx store files: `*.actions.ts`, `*.reducer.ts`, `*.effects.ts`, `*.selectors.ts`, `*.state.ts`
- Configuration files: `*.config.ts`, `*.constants.ts`, `*.routes.ts`, `theme.ts`
- Type definitions: `*.model.ts`, `*.interface.ts`, `*.type.ts`
- Barrel exports: `index.ts`
- Environment files: `environments/**`
- Test files: `*.spec.ts`

**Coverage Thresholds** (global):
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Common Patterns

### Using Facades
```typescript
// Inject facade
private tasksFacade = inject(TasksFacade);

// Access state via signals
readonly tasks = this.tasksFacade.tasks;
readonly loading = this.tasksFacade.loading;

// Dispatch actions via methods
this.tasksFacade.loadTasks();
this.tasksFacade.createTask(newTask);
```

### Error Handling
```typescript
// In effect
loadTasks$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TasksActions.loadTasks),
    exhaustMap(() =>
      this.tasksApi.getTasks().pipe(
        map(tasks => TasksActions.loadTasksSuccess({ tasks })),
        catchError(error => of(TasksActions.loadTasksFailure({ error: error.message })))
      )
    )
  )
);
```

### Toast Notifications
```typescript
// Inject MessageService
private messageService = inject(MessageService);

// Show notification
this.messageService.add({
  severity: 'success',
  summary: this.translate.instant('tasks.messages.created'),
  detail: this.translate.instant('tasks.messages.taskCreatedSuccessfully')
});
```

### Using PrimeNG Dialogs
```typescript
// Inject DialogService
private dialogService = inject(DialogService);

// Open dialog
const ref = this.dialogService.open(TaskDialogComponent, {
  header: this.translate.instant('tasks.dialog.create'),
  data: { task: null }  // null for create, task object for edit
});

// Handle dialog result
ref.onClose.subscribe((result) => {
  if (result) {
    // Handle result
  }
});
```

## Testing Patterns

### Writing Component Tests

**Basic Test Structure**:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// FakeLoader for ngx-translate
class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;
  let mockFacade: {
    property: ReturnType<typeof signal<Type>>;
    method: jest.Mock;
  };

  beforeEach(async () => {
    // Create mocks
    mockFacade = {
      property: signal<Type>(initialValue),
      method: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ExampleComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
      providers: [
        { provide: ExampleFacade, useValue: mockFacade },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Use to skip child component errors
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Mocking Facades

**Signal-based Facade Mock**:
```typescript
let mockTasksFacade: {
  // Signals
  tasks: ReturnType<typeof signal<Task[]>>;
  loading: ReturnType<typeof signal<boolean>>;
  error: ReturnType<typeof signal<string | null>>;

  // Methods
  loadTasks: jest.Mock;
  createTask: jest.Mock;
  updateTask: jest.Mock;
  deleteTask: jest.Mock;
};

beforeEach(() => {
  mockTasksFacade = {
    tasks: signal<Task[]>([]),
    loading: signal<boolean>(false),
    error: signal<string | null>(null),
    loadTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };
});
```

### Mocking Services

**Service with Observables**:
```typescript
let mockBoardService: {
  handleAddTaskDialog: jest.Mock;
  applyFilters: jest.Mock;
};

beforeEach(() => {
  mockBoardService = {
    handleAddTaskDialog: jest.fn().mockReturnValue(of({ severity: 'success' })),
    applyFilters: jest.fn(),
  };
});
```

**PrimeNG Services**:
```typescript
// MessageService - use real instance
let messageService: MessageService;

beforeEach(() => {
  messageService = new MessageService();
  jest.spyOn(messageService, 'add');
});

// DialogService - mock only what you need
providers: [
  { provide: DialogService, useValue: {} },
]
```

### Testing Router Components

For components using `RouterLink`:
```typescript
import { provideRouter } from '@angular/router';

await TestBed.configureTestingModule({
  imports: [ExampleComponent],
  providers: [
    provideRouter([]), // Empty routes for testing
  ],
}).compileComponents();
```

### Overriding Component Providers

When component has its own providers:
```typescript
await TestBed.configureTestingModule({
  imports: [BoardComponent],
  providers: [
    { provide: AuthFacade, useValue: mockAuthFacade },
  ],
})
  .overrideComponent(BoardComponent, {
    set: {
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: MessageService, useValue: messageService },
      ],
    },
  })
  .compileComponents();
```

### Testing Best Practices

1. **Mock Facades, Not Store**: Always mock facade services, never inject real NgRx Store in component tests
2. **Use Signals in Mocks**: Match the real facade API using `signal()` for reactive properties
3. **Test Behavior, Not Implementation**: Focus on what the component does, not how
4. **Avoid Testing Effects in Components**: Effects should be tested separately in effect/facade tests
5. **Use NO_ERRORS_SCHEMA Wisely**: Use it to skip child component errors, but test child interactions when needed
6. **Keep Tests Simple**: One concept per test, clear arrange-act-assert structure
7. **Mock External Dependencies**: Always mock services, facades, and external APIs

### What NOT to Test

- NgRx store logic (actions, reducers, effects, selectors) - these are excluded from coverage
- Configuration files (routes, theme, constants)
- Type definitions and interfaces
- Barrel exports (index.ts files)
- PrimeNG component internals
- Angular framework behavior

### Test Organization

```typescript
describe('ComponentName', () => {
  // Setup
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    // TestBed configuration
  });

  it('should create', () => {
    // Basic creation test
  });

  describe('Initialization', () => {
    // Tests for ngOnInit, constructor effects
  });

  describe('Public Methods', () => {
    // Tests for each public method
  });

  describe('Computed Values', () => {
    // Tests for computed signals
  });

  describe('Facade Integration', () => {
    // Tests for facade property/method usage
  });

  describe('Edge Cases', () => {
    // Tests for edge cases and error scenarios
  });
});
```

## File References

When working with this codebase, key files to reference:

- **App Bootstrap**: `src/main.ts`, `src/app/app.config.ts`
- **Routing**: `src/app/app.routes.ts`
- **Theme**: `src/theme.ts`
- **Auth**: `src/app/core/auth/auth.facade.ts`
- **Tasks**: `src/app/feature/tasks/tasks.facade.ts`
- **API Config**: `src/app/core/api/config/constants/api-endpoints.constants.ts`
- **Environment**: `src/app/environments/environment.ts`
- **Translations**: `public/assets/i18n/pl.json`, `public/assets/i18n/en.json`
- **Jest Config**: `jest.config.ts`
- **Jest Setup**: `setup-jest.ts`

## Jest Configuration

### Key Configuration Files

**`jest.config.ts`**: Main Jest configuration
- Test environment: `jsdom`
- Preset: `jest-preset-angular`
- Module name mappers for path aliases (`@core`, `@feature`, etc.)
- Coverage collection and thresholds
- Files excluded from coverage

**`setup-jest.ts`**: Jest setup file
- Imports `jest-preset-angular/setup-jest`
- Global test configuration
- Polyfills and test environment setup

### Running Specific Tests

```bash
# Run specific test file
npm test -- path/to/file.spec.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create"

# Run tests in specific directory
npm test -- src/app/view/

# Run with coverage for specific file
npm test -- path/to/file.spec.ts --coverage --collectCoverageFrom="src/path/to/file.ts"
```

### Troubleshooting Tests

**Common Issues**:

1. **"No provider found for X"**: Missing service/facade mock in providers or missing `provideRouter([])`
2. **"Cannot read properties of undefined"**: Facade mock missing signal or method
3. **Template errors**: Add `NO_ERRORS_SCHEMA` or properly mock child components
4. **Coverage 0%**: Test file name doesn't match - ensure `*.spec.ts` naming

**Dependencies**:
- Remove `ng-mocks` if using Angular 21+ (incompatible)
- Use manual mocks with Jest instead of ng-mocks

## Important Notes

### TypeScript Deprecation Warnings

You may see TypeScript deprecation warnings in `node_modules/rxjs/tsconfig.json`:
- `moduleResolution: "node"` is deprecated
- `baseUrl` is deprecated

**Do NOT modify files in `node_modules`** - these are external library files. To silence warnings, add to your project's `tsconfig.json`:
```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0"
  }
}
```

### Package Management

- Use `npm install` (not `npm install --legacy-peer-deps`) - all dependencies are compatible
- If you encounter peer dependency conflicts, check if package supports Angular 21
- Pre-commit hooks run automatically via Husky (Prettier + ESLint on staged files)
