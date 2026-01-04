import { test, expect } from '@playwright/test';

/**
 * Example E2E test for the Angular application
 * This test verifies that the application loads successfully
 */
test.describe('Team Board Application', () => {
  test('should load the application successfully', async ({ page }) => {
    // Navigate to the application root
    await page.goto('/');

    // Wait for the application to be ready
    await page.waitForLoadState('networkidle');

    // Verify that the page title is set
    await expect(page).toHaveTitle('TeamBoard');

    // Verify that the main app element is present
    const appRoot = page.locator('tb-root');
    await expect(appRoot).toBeVisible();
  });

  test('should display the login page for unauthenticated users', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    // Verify that the login component or form is visible
    // Adjust the selector based on your actual login page structure
    const loginElement = page.locator('tb-login, [data-testid="login-form"]').first();

    // Check if we're on the login page (URL should contain 'login' or show login component)
    const currentUrl = page.url();
    const isLoginVisible = await loginElement.isVisible().catch(() => false);

    // At least one condition should be true
    expect(
      currentUrl.includes('login') || isLoginVisible
    ).toBeTruthy();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Check viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', /width=device-width/);
  });
});
