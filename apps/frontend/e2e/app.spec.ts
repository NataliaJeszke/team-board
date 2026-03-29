import { test, expect } from '@playwright/test';

/**
 * Basic E2E tests for the Angular application
 * This test suite verifies core application functionality
 */
test.describe('Team Board Application - Basic Tests', () => {
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

  test('should have proper HTML structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify HTML lang attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');

    // Verify meta charset
    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveAttribute('charset', 'utf-8');

    // Check viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', /width=device-width/);
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    // Listen for console errors
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // There should be no critical JavaScript errors
    expect(errors).toHaveLength(0);
  });

  test('should have favicon', async ({ page }) => {
    await page.goto('/');

    // Check if favicon link exists
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', 'favicon.ico');
  });
});
