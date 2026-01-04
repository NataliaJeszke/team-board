import { Page } from '@playwright/test';
import { SELECTORS } from './test-data';

/**
 * Helper functions for authentication in E2E tests
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Performs login via UI
 * @param page - Playwright page object
 * @param credentials - User credentials
 */
export async function loginViaUI(page: Page, credentials: LoginCredentials): Promise<void> {
  // Navigate to login page
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Fill login form
  await page.locator(SELECTORS.login.emailInput).fill(credentials.email);
  await page.locator(SELECTORS.login.passwordInput).fill(credentials.password);

  // Submit form
  await page.locator(SELECTORS.login.submitButton).click();

  // Wait for navigation to board
  await page.waitForURL(/\/board$/, { timeout: 10000 });
}

/**
 * Performs login via API and sets authentication state
 * This is faster than UI login and can be used in beforeEach hooks
 * Note: Requires backend to be running
 */
export async function loginViaAPI(
  page: Page,
  credentials: LoginCredentials
): Promise<void> {
  // Make API request to login endpoint
  const response = await page.request.post('/api/auth/login', {
    data: credentials,
  });

  if (!response.ok()) {
    throw new Error(`Login failed: ${response.status()} ${response.statusText()}`);
  }

  const data = await response.json();

  // Store token and user data in localStorage (matching your app's auth implementation)
  await page.evaluate(
    ({ token, user }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    { token: data.token, user: data.user }
  );

  // Navigate to board
  await page.goto('/board');
  await page.waitForLoadState('networkidle');
}

/**
 * Checks if user is logged in by verifying presence of board elements
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const currentUrl = page.url();
  if (!currentUrl.includes('/board')) {
    return false;
  }

  // Check if header is visible (only shown when logged in)
  const headerVisible = await page.locator('tb-header').isVisible().catch(() => false);
  return headerVisible;
}

/**
 * Logs out the user via UI (clicking logout in menu)
 */
export async function logoutViaUI(page: Page): Promise<void> {
  // Click user menu button
  await page.locator('.header__user').click();

  // Wait for menu to open
  await page.waitForTimeout(500);

  // Click logout option
  await page.locator('button:has-text("Logout"), .p-menuitem:has-text("Logout")').click();

  // Wait for redirect to login
  await page.waitForURL(/\/login$/, { timeout: 5000 });
}

/**
 * Clears authentication state (localStorage)
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  });
}
