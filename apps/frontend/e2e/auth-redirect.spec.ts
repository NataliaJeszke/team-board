import { test, expect } from '@playwright/test';

/**
 * E2E tests for application initialization and authentication redirects
 */
test.describe('Application Initialization', () => {
  test('should redirect unauthenticated user from root to /login', async ({ page }) => {
    // Navigate to the application root
    await page.goto('/');

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    // Verify that we were redirected to /login
    await expect(page).toHaveURL(/\/login$/);
  });

  test('should redirect unauthenticated user from /board to /login', async ({ page }) => {
    // Try to access protected board route
    await page.goto('/board');

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    // Verify that we were redirected to /login
    await expect(page).toHaveURL(/\/login$/);
  });

  test('should allow access to /register without authentication', async ({ page }) => {
    // Navigate to register page
    await page.goto('/register');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify we stayed on /register
    await expect(page).toHaveURL(/\/register$/);
  });

  test('should allow access to /login without authentication', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify we stayed on /login
    await expect(page).toHaveURL(/\/login$/);
  });
});
