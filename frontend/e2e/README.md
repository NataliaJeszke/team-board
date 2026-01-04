# E2E Testing with Playwright

This directory contains end-to-end (E2E) tests for the Team Board Angular application using Playwright.

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

## Running E2E Tests

### Prerequisites

Ensure the Angular dev server is running or use the built-in webServer feature (configured in `playwright.config.ts`).

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

# Run tests matching a pattern
npx playwright test --grep "login"

# Run a specific test by line number
npx playwright test e2e/app.spec.ts:15
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
