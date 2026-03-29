# E2E Testing with Playwright

This directory contains end-to-end (E2E) tests for the Team Board Angular application using Playwright.

## Test Files Structure

```
e2e/
├── app.spec.ts              # Basic application tests (HTML structure, meta tags, loading)
├── auth-redirect.spec.ts    # Authentication redirects and route guards
├── login-page.spec.ts       # Login page UI elements and validation
├── register-page.spec.ts    # Register page UI elements and validation
├── auth-flow.spec.ts        # Complete authentication flow (registration + login)
├── board-page.spec.ts       # Board page tests (header, menu, tasks display)
├── task-dialog.spec.ts      # Task dialog tests (add task form, validation, submission)
├── helpers/
│   ├── test-data.ts         # Test data generators and common selectors
│   └── auth-helpers.ts      # Authentication helper functions
└── README.md                # This file
```

## Purpose

E2E tests validate the application's behavior from a user's perspective by simulating real user interactions in a browser environment. These tests complement the Jest-based unit tests by:

- **Testing user workflows**: Verify complete user journeys (login, task creation, filtering, etc.)
- **Cross-browser validation**: Ensure the app works correctly across different browsers
- **Integration verification**: Test how all components work together in a real environment
- **Visual regression**: Detect unintended UI changes

## Why Playwright?

Playwright is chosen for E2E testing because it:

1. **Modern and Fast**: Built for modern web apps with excellent performance
2. **Cross-browser Support**: Tests on Chromium, Firefox, and WebKit with a single API
3. **Auto-wait**: Automatically waits for elements to be ready before performing actions
4. **Debugging Tools**: Powerful debugging with UI mode, trace viewer, and inspector
5. **TypeScript Support**: First-class TypeScript support out of the box
6. **Reliable**: Auto-retries and smart waiting reduce flaky tests
7. **DevTools Integration**: Works seamlessly with browser DevTools

## How It Complements Jest

| Aspect | Jest (Unit Tests) | Playwright (E2E Tests) |
|--------|------------------|----------------------|
| **Scope** | Individual components/services | Complete user workflows |
| **Speed** | Very fast (milliseconds) | Slower (seconds) |
| **Isolation** | Fully isolated with mocks | Real environment |
| **Purpose** | Verify logic correctness | Verify user experience |
| **Dependencies** | Mocked | Real (API, routing, etc.) |
| **When to Run** | On every change | Before deployment |

**Best Practice**: Write many unit tests (Jest) and fewer, focused E2E tests (Playwright).

## Test Suites Overview

### 1. **app.spec.ts** - Basic Application Tests
Tests core application functionality:
- Application loads successfully
- HTML structure is correct
- No JavaScript errors on load
- Meta tags are properly set

### 2. **auth-redirect.spec.ts** - Authentication Redirects
Tests routing and authentication guards:
- Unauthenticated users redirected to `/login`
- Protected routes (e.g., `/board`) require authentication
- Public routes (e.g., `/register`) accessible without auth

### 3. **login-page.spec.ts** - Login Page UI
Tests all UI elements on login page:
- Email and password inputs visible
- Submit button state (enabled/disabled)
- Form validation messages
- Navigation to register page
- Password toggle functionality

### 4. **register-page.spec.ts** - Register Page UI
Tests all UI elements on register page:
- Name, email, and password inputs visible
- Submit button state
- Form validation
- Navigation to login page
- Proper layout and styling

### 5. **auth-flow.spec.ts** - Authentication Flow (Requires Backend)
Tests actual registration and login functionality:
- User registration with valid data
- Login with valid credentials
- Error handling for invalid credentials
- Complete flow: register → login → access board
- Loading states during API calls

**Note**: `auth-flow.spec.ts` requires a running backend server to work properly.

### 6. **board-page.spec.ts** - Board Page Tests (Requires Backend & Auth)
Tests the main board view after successful login:
- Board component visibility
- Header with all elements (title, add task button, menu, theme toggle)
- User menu expandability and functionality
- Add task button visibility and clickability
- Menu items (Language, Logout)
- Empty state display (no tasks)
- Tasks grid display (with tasks)
- Filters component
- Responsive layout

**Note**: This test suite requires a logged-in user, so backend must be running.

### 7. **task-dialog.spec.ts** - Task Dialog Tests (Requires Backend & Auth)
Tests the Add Task dialog functionality:
- Dialog opens when clicking Add Task button
- All form fields visible (Title, Assigned To, Priority, Status)
- Cancel and Save buttons present
- Default values (Priority: "Medium", Status: "To Do")
- Form validation (title required, minimum 3 characters)
- Error messages ("This field is required")
- Priority select with options (Low, Medium, High)
- Status select with options (To Do, In Progress, Delayed, Done)
- Assigned To select with user list
- Cancel closes dialog without saving
- Save submits task to backend
- Complete task creation flow

**Note**: Requires logged-in user and running backend for save functionality.

## Running E2E Tests

### Prerequisites

- **Frontend**: Angular dev server will start automatically (configured in `playwright.config.ts`)
- **Backend** (for auth-flow tests): Ensure backend API is running if testing authentication flows

### Available Commands

```bash
# Run all E2E tests in headless mode
npm run e2e

# Run tests with interactive UI mode (recommended for development)
npm run e2e:ui

# Run tests in headed mode (see the browser)
npm run e2e:headed

# Debug tests with Playwright Inspector
npm run e2e:debug

# View the last test report
npm run e2e:report
```

### Running Specific Tests

```bash
# Run a specific test file
npx playwright test e2e/app.spec.ts

# Run specific test suite
npx playwright test e2e/login-page.spec.ts
npx playwright test e2e/register-page.spec.ts
npx playwright test e2e/auth-redirect.spec.ts
npx playwright test e2e/auth-flow.spec.ts
npx playwright test e2e/board-page.spec.ts
npx playwright test e2e/task-dialog.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"
npx playwright test --grep "registration"

# Run UI tests only (excluding flow tests that require backend)
npx playwright test e2e/app.spec.ts e2e/auth-redirect.spec.ts e2e/login-page.spec.ts e2e/register-page.spec.ts

# Run a specific test by line number
npx playwright test e2e/app.spec.ts:15
```

### Test Helpers

### Test Data Helpers (`helpers/test-data.ts`)

Utilities for test data and selectors:

- **`generateUniqueEmail()`** - Creates unique email addresses for testing
- **`generateTestUser()`** - Generates complete test user objects
- **`TEST_USERS`** - Predefined test user credentials
- **`SELECTORS`** - Common CSS selectors (login, register, common)
- **`BOARD_SELECTORS`** - Board page specific selectors (header, menu, board)
- **`TASK_DIALOG_SELECTORS`** - Task dialog selectors (inputs, buttons, validation)
- **`TIMEOUTS`** - Standard timeout values for different operations

Example usage:
```typescript
import { generateTestUser, SELECTORS, BOARD_SELECTORS } from './helpers/test-data';

const user = generateTestUser('John Doe');
await page.locator(SELECTORS.login.emailInput).fill(user.email);
await page.locator(BOARD_SELECTORS.header.addTaskButton).click();
```

### Authentication Helpers (`helpers/auth-helpers.ts`)

Helper functions for authentication:

- **`loginViaUI(page, credentials)`** - Login through the UI (slow but realistic)
- **`loginViaAPI(page, credentials)`** - Login via API (fast, for setup)
- **`isLoggedIn(page)`** - Check if user is authenticated
- **`logoutViaUI(page)`** - Logout through the UI
- **`clearAuthState(page)`** - Clear authentication from localStorage

Example usage:
```typescript
import { loginViaUI, logoutViaUI } from './helpers/auth-helpers';

// In test setup
await loginViaUI(page, { email: 'test@example.com', password: 'password' });

// In test
await logoutViaUI(page);
```

## Writing E2E Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Navigate to page
    await page.goto('/path');

    // Interact with elements
    await page.click('button');
    await page.fill('input[name="email"]', 'user@example.com');

    // Assert results
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### Best Practices

1. **Use Data Test IDs**: Add `data-testid` attributes to elements for stable selectors
   ```html
   <button data-testid="submit-btn">Submit</button>
   ```
   ```typescript
   await page.click('[data-testid="submit-btn"]');
   ```

2. **Group Related Tests**: Use `test.describe()` to organize tests by feature

3. **Use Page Objects**: For complex pages, create page object models (POM)

4. **Keep Tests Independent**: Each test should be able to run in isolation

5. **Use Auto-waiting**: Playwright waits automatically, avoid manual `waitFor` unless necessary

6. **Test User Flows, Not Implementation**: Focus on what users do, not how it's coded

## Configuration

E2E test configuration is in `playwright.config.ts` at the project root:

- **Test directory**: `./e2e`
- **Base URL**: `http://localhost:4200`
- **Browser**: Chromium (headless by default)
- **Reports**: HTML report in `playwright-report/`
- **Web Server**: Automatically starts `npm start` before tests

## CI/CD Integration

In CI environments, Playwright automatically:
- Runs in headless mode
- Uses `forbidOnly` to prevent `.only` tests
- Retries failed tests 2 times
- Runs tests serially (workers: 1)

## Debugging

### UI Mode (Recommended)
```bash
npm run e2e:ui
```
Interactive mode with time-travel debugging, watch mode, and picker.

### Debug Mode
```bash
npm run e2e:debug
```
Opens Playwright Inspector for step-by-step debugging.

### Trace Viewer
After a test failure, view the trace:
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Debugging Tests](https://playwright.dev/docs/debug)
