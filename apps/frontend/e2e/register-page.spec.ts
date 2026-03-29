import { test, expect } from '@playwright/test';

/**
 * E2E tests for Register Page UI elements and validation
 */
test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to register page before each test
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
  });

  test('should display all required UI elements', async ({ page }) => {
    // Verify page title
    const pageTitle = page.locator('h1');
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toContainText('Registration');

    // Verify subtitle
    const subtitle = page.locator('p.text-surface-600');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Create a new account');

    // Verify name input
    const nameInput = page.locator('input[type="text"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('placeholder', 'Name');

    // Verify email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'Email');

    // Verify password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('placeholder', 'Enter password');

    // Verify password label
    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toBeVisible();
    await expect(passwordLabel).toContainText('Password');

    // Verify submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Sign Up');

    // Verify link to login page
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toContainText('Sign In');

    // Verify footer text
    const footerText = page.locator('p.text-sm.text-surface-600');
    await expect(footerText).toContainText('Already have an account?');
  });

  test('should have password toggle functionality visible', async ({ page }) => {
    // Verify password toggle button exists (PrimeNG password component)
    const passwordToggle = page.locator('button[type="button"]').filter({ hasText: '' }).first();
    await expect(passwordToggle).toBeVisible();
  });

  test('should have submit button disabled when form is empty', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Button should be disabled initially
    await expect(submitButton).toBeDisabled();
  });

  test('should have all three input fields', async ({ page }) => {
    // Verify all input fields are present
    const nameInput = page.locator('input[placeholder="Name"]');
    const emailInput = page.locator('input[placeholder="Email"]');
    const passwordInput = page.locator('input[placeholder="Enter password"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should enable submit button when all fields are filled with valid data', async ({ page }) => {
    const nameInput = page.locator('input[placeholder="Name"]');
    const emailInput = page.locator('input[placeholder="Email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill all fields with valid data
    await nameInput.fill('John Doe');
    await emailInput.fill('john.doe@example.com');
    await passwordInput.fill('SecurePass123');

    // Submit button should now be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should keep submit button disabled if any field is empty', async ({ page }) => {
    const nameInput = page.locator('input[placeholder="Name"]');
    const emailInput = page.locator('input[placeholder="Email"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill only name and email, leave password empty
    await nameInput.fill('John Doe');
    await emailInput.fill('john.doe@example.com');

    // Submit button should still be disabled
    await expect(submitButton).toBeDisabled();
  });

  test('should navigate to login page when clicking Sign In link', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]');

    // Click the login link
    await loginLink.click();

    // Wait for navigation
    await page.waitForURL(/\/login$/);

    // Verify we're on login page
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('h1')).toContainText('Login');
  });

  test('should have proper card layout structure', async ({ page }) => {
    // Verify card wrapper exists
    const card = page.locator('p-card');
    await expect(card).toBeVisible();

    // Verify form exists inside card
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should have centered layout on the page', async ({ page }) => {
    // Verify main container has centering classes
    const container = page.locator('div.min-h-screen.flex.items-center.justify-center');
    await expect(container).toBeVisible();
  });
});
