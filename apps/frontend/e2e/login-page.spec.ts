import { test, expect } from '@playwright/test';

/**
 * E2E tests for Login Page UI elements and validation
 */
test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display all required UI elements', async ({ page }) => {
    // Verify page title
    const pageTitle = page.locator('h1');
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toContainText('Login');

    // Verify subtitle
    const subtitle = page.locator('p.text-surface-600');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Welcome back');

    // Verify email input
    const emailInput = page.locator('input#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('placeholder', 'your@email.com');

    // Verify email label
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    await expect(emailLabel).toContainText('Email');

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
    await expect(submitButton).toContainText('Sign In');

    // Verify link to register page
    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toContainText('Sign Up');

    // Verify footer text
    const footerText = page.locator('p.text-sm.text-surface-600');
    await expect(footerText).toContainText("Don't have an account?");
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

  test('should show validation error for invalid email', async ({ page }) => {
    const emailInput = page.locator('input#email');
    const submitButton = page.locator('button[type="submit"]');

    // Enter invalid email and blur
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Try to submit to trigger validation
    await submitButton.click({ force: true });

    // Wait for validation message
    const errorMessage = page.locator('small.text-red-500').first();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('valid email');
  });

  test('should show validation error for empty password', async ({ page }) => {
    const emailInput = page.locator('input#email');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Enter valid email
    await emailInput.fill('test@example.com');

    // Click password field and blur without entering anything
    await passwordInput.click();
    await passwordInput.blur();

    // Try to submit
    await submitButton.click({ force: true });

    // Should show password validation error
    const errorMessage = page.locator('small.text-red-500');
    await expect(errorMessage).toBeVisible();
  });

  test('should enable submit button when form is valid', async ({ page }) => {
    const emailInput = page.locator('input#email');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill valid credentials
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Submit button should now be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should navigate to register page when clicking Sign Up link', async ({ page }) => {
    const registerLink = page.locator('a[href="/register"]');

    // Click the register link
    await registerLink.click();

    // Wait for navigation
    await page.waitForURL(/\/register$/);

    // Verify we're on register page
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.locator('h1')).toContainText('Registration');
  });

  test('should have proper card layout structure', async ({ page }) => {
    // Verify card wrapper exists
    const card = page.locator('p-card');
    await expect(card).toBeVisible();

    // Verify form exists inside card
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });
});
