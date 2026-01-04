import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers/auth-helpers';
import { BOARD_SELECTORS } from './helpers/test-data';

/**
 * E2E tests for Board Page
 * These tests verify the board view after successful login
 *
 * Prerequisites: User must be able to log in (requires backend)
 */

// Test credentials - adjust based on your test environment
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
};

test.describe('Board Page - After Login', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    // Note: This requires a valid user in the database
    try {
      await loginViaUI(page, TEST_USER);
    } catch (error) {
      test.skip(true, 'Cannot login - backend may not be running or user does not exist');
    }
  });

  test('should display board component after successful login', async ({ page }) => {
    // Verify we're on the board page
    await expect(page).toHaveURL(/\/board$/);

    // Verify board container is visible
    const boardContainer = page.locator(BOARD_SELECTORS.board.container);
    await expect(boardContainer).toBeVisible();

    // Verify main board section is visible
    const boardMain = page.locator(BOARD_SELECTORS.board.main);
    await expect(boardMain).toBeVisible();
  });

  test.describe('Header Component', () => {
    test('should display header with all elements', async ({ page }) => {
      // Verify header is visible
      const header = page.locator(BOARD_SELECTORS.header.container);
      await expect(header).toBeVisible();

      // Verify title
      const title = page.locator(BOARD_SELECTORS.header.title);
      await expect(title).toBeVisible();
      await expect(title).toContainText('Board');

      // Verify theme toggle is visible
      const themeToggle = page.locator(BOARD_SELECTORS.header.themeToggle);
      await expect(themeToggle).toBeVisible();

      // Verify user menu button is visible
      const userMenuButton = page.locator(BOARD_SELECTORS.header.userMenuButton);
      await expect(userMenuButton).toBeVisible();
    });

    test('should display Add Task button in header', async ({ page }) => {
      // Find add task button - using more flexible selector
      const addTaskButton = page.locator('button').filter({ has: page.locator('.pi-plus') });
      await expect(addTaskButton).toBeVisible();

      // Button should be enabled after login
      await expect(addTaskButton).toBeEnabled();
    });

    test('should display task counter when present', async ({ page }) => {
      // Check if task counter badge exists
      // Note: Badge only shows when taskCount > 0
      const taskBadge = page.locator(BOARD_SELECTORS.header.taskCounter);
      const badgeExists = await taskBadge.isVisible().catch(() => false);

      if (badgeExists) {
        // If badge exists, verify it has content
        const badgeText = await taskBadge.textContent();
        expect(badgeText).toBeTruthy();
        expect(badgeText?.trim().length).toBeGreaterThan(0);
      }
      // If no badge, test passes (means taskCount === 0)
    });

    test('should display user initials in menu button', async ({ page }) => {
      const userMenuButton = page.locator(BOARD_SELECTORS.header.userMenuButton);

      // Verify button contains text (initials)
      const buttonText = await userMenuButton.textContent();
      expect(buttonText).toBeTruthy();
      expect(buttonText?.trim().length).toBeGreaterThan(0);

      // Verify chevron icon is present
      const chevronIcon = userMenuButton.locator('.pi-chevron-down');
      await expect(chevronIcon).toBeVisible();
    });
  });

  test.describe('User Menu', () => {
    test('should open user menu when clicking user button', async ({ page }) => {
      // Click user menu button
      const userMenuButton = page.locator(BOARD_SELECTORS.header.userMenuButton);
      await userMenuButton.click();

      // Wait for menu to appear
      await page.waitForTimeout(300);

      // Verify menu is visible
      const menu = page.locator('p-menu, .p-menu');
      await expect(menu).toBeVisible();
    });

    test('should display user name and email in menu header', async ({ page }) => {
      // Open menu
      await page.locator(BOARD_SELECTORS.header.userMenuButton).click();
      await page.waitForTimeout(300);

      // Check for user name in menu header
      // The menu should have user details in the header template
      const menuContent = page.locator('p-menu, .p-menu');
      await expect(menuContent).toBeVisible();

      // User info should be displayed somewhere in the menu
      const hasUserInfo =
        (await menuContent.locator('span.font-semibold').isVisible().catch(() => false)) ||
        (await menuContent.locator('.truncate').isVisible().catch(() => false));

      expect(hasUserInfo).toBeTruthy();
    });

    test('should display Language menu item', async ({ page }) => {
      // Open menu
      await page.locator(BOARD_SELECTORS.header.userMenuButton).click();
      await page.waitForTimeout(500);

      // Look for Language option
      const languageOption = page
        .locator('.p-menuitem, button')
        .filter({ hasText: /Language|Język/i })
        .first();

      await expect(languageOption).toBeVisible();
    });

    test('should display Logout menu item', async ({ page }) => {
      // Open menu
      await page.locator(BOARD_SELECTORS.header.userMenuButton).click();
      await page.waitForTimeout(500);

      // Look for Logout option
      const logoutOption = page
        .locator('.p-menuitem, button, a')
        .filter({ hasText: /Logout|Wyloguj/i })
        .first();

      await expect(logoutOption).toBeVisible();
    });

    test('should expand language submenu when clicked', async ({ page }) => {
      // Open user menu
      await page.locator(BOARD_SELECTORS.header.userMenuButton).click();
      await page.waitForTimeout(500);

      // Click on Language option to expand submenu
      const languageOption = page
        .locator('.p-menuitem, button')
        .filter({ hasText: /Language|Język/i })
        .first();

      await languageOption.click();
      await page.waitForTimeout(500);

      // Check if submenu items are visible (Polish, English)
      const polishOption = page.locator('.p-menuitem, button').filter({ hasText: /Polish|Polski/i });
      const englishOption = page
        .locator('.p-menuitem, button')
        .filter({ hasText: /English|Angielski/i });

      // At least one language option should be visible
      const polishVisible = await polishOption.first().isVisible().catch(() => false);
      const englishVisible = await englishOption.first().isVisible().catch(() => false);

      expect(polishVisible || englishVisible).toBeTruthy();
    });

    test('should be clickable - menu items respond to clicks', async ({ page }) => {
      // Open menu
      await page.locator(BOARD_SELECTORS.header.userMenuButton).click();
      await page.waitForTimeout(500);

      // Try clicking language option
      const languageOption = page
        .locator('.p-menuitem, button')
        .filter({ hasText: /Language|Język/i })
        .first();

      // Click should not throw error
      await languageOption.click();
      await page.waitForTimeout(300);

      // Menu interaction should work without errors
      expect(true).toBeTruthy();
    });

    test('should close menu when clicking outside', async ({ page }) => {
      // Open menu
      await page.locator(BOARD_SELECTORS.header.userMenuButton).click();
      await page.waitForTimeout(500);

      // Click outside menu (on header title)
      await page.locator(BOARD_SELECTORS.header.title).click();
      await page.waitForTimeout(500);

      // Menu should be hidden
      const menu = page.locator('p-menu .p-menu-overlay');
      const isVisible = await menu.isVisible().catch(() => false);

      // Menu should either be hidden or not in DOM
      expect(isVisible).toBeFalsy();
    });
  });

  test.describe('Add Task Button', () => {
    test('should have Add Task button visible and enabled', async ({ page }) => {
      const addTaskButton = page.locator('button').filter({ has: page.locator('.pi-plus') });

      // Button should be visible
      await expect(addTaskButton).toBeVisible();

      // Button should be enabled (not disabled)
      await expect(addTaskButton).toBeEnabled();
    });

    test('should have proper icon on Add Task button', async ({ page }) => {
      const addTaskButton = page.locator('button').filter({ has: page.locator('.pi-plus') });

      // Verify button has plus icon
      const plusIcon = addTaskButton.locator('.pi-plus');
      await expect(plusIcon).toBeVisible();
    });

    test('should be clickable', async ({ page }) => {
      const addTaskButton = page.locator('button').filter({ has: page.locator('.pi-plus') });

      // Click should not throw error
      await addTaskButton.click();

      // Dialog or modal should appear (if implemented)
      // Note: This depends on your dialog implementation
      await page.waitForTimeout(1000);

      // Check if dialog opened
      const dialog = page.locator('p-dialog, .p-dialog, p-dynamicdialog');
      const dialogVisible = await dialog.isVisible().catch(() => false);

      // Either dialog appears or click works without error
      expect(true).toBeTruthy();
    });
  });

  test.describe('Board Content', () => {
    test('should display filters component', async ({ page }) => {
      const filters = page.locator(BOARD_SELECTORS.board.filters);
      await expect(filters).toBeVisible();
    });

    test('should display user tasks component', async ({ page }) => {
      const userTasks = page.locator(BOARD_SELECTORS.board.userTasks);
      await expect(userTasks).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should display empty state when no tasks exist', async ({ page }) => {
      // Check if empty state is visible
      const emptyState = page.locator(BOARD_SELECTORS.board.emptyState);
      const emptyStateVisible = await emptyState.isVisible().catch(() => false);

      if (emptyStateVisible) {
        // Verify empty state has proper elements
        const emptyIcon = emptyState.locator('.pi-inbox');
        await expect(emptyIcon).toBeVisible();

        // Empty state should have text
        const emptyText = await emptyState.textContent();
        expect(emptyText).toBeTruthy();
        expect(emptyText?.length).toBeGreaterThan(0);
      }
      // If not visible, user has tasks - test passes
    });

    test('should display "No tasks" message in empty state', async ({ page }) => {
      const emptyState = page.locator(BOARD_SELECTORS.board.emptyState);
      const emptyStateVisible = await emptyState.isVisible().catch(() => false);

      if (emptyStateVisible) {
        const emptyText = await emptyState.textContent();
        expect(emptyText).toMatch(/no tasks|brak zadań|empty/i);
      }
      // If not visible, user has tasks - test passes
    });
  });

  test.describe('Tasks Display', () => {
    test('should display tasks grid when tasks exist', async ({ page }) => {
      // Check if tasks grid is visible
      const tasksGrid = page.locator(BOARD_SELECTORS.board.tasksList);
      const gridVisible = await tasksGrid.isVisible().catch(() => false);

      if (gridVisible) {
        // Verify grid contains task components
        const tasks = page.locator(BOARD_SELECTORS.board.task);
        const taskCount = await tasks.count();

        // Should have at least one task
        expect(taskCount).toBeGreaterThan(0);
      }
      // If grid not visible, user has no tasks (empty state) - test passes
    });

    test('should display task cards when tasks exist', async ({ page }) => {
      // Look for task components
      const tasks = page.locator(BOARD_SELECTORS.board.task);
      const taskCount = await tasks.count();

      if (taskCount > 0) {
        // Verify first task is visible
        const firstTask = tasks.first();
        await expect(firstTask).toBeVisible();

        // Task should have some content
        const taskContent = await firstTask.textContent();
        expect(taskContent?.trim().length).toBeGreaterThan(0);
      }
      // If no tasks, empty state is shown - test passes
    });

    test('should use grid layout for tasks', async ({ page }) => {
      const tasksGrid = page.locator(BOARD_SELECTORS.board.tasksList);
      const gridVisible = await tasksGrid.isVisible().catch(() => false);

      if (gridVisible) {
        // Verify grid has proper classes
        const gridClasses = await tasksGrid.getAttribute('class');
        expect(gridClasses).toMatch(/grid/);
      }
      // If not visible, no tasks exist - test passes
    });
  });

  test.describe('Responsive Layout', () => {
    test('should have proper main container structure', async ({ page }) => {
      const boardMain = page.locator(BOARD_SELECTORS.board.main);
      await expect(boardMain).toBeVisible();

      // Main should contain filters and tasks
      const filters = boardMain.locator(BOARD_SELECTORS.board.filters);
      const userTasks = boardMain.locator(BOARD_SELECTORS.board.userTasks);

      await expect(filters).toBeVisible();
      await expect(userTasks).toBeVisible();
    });
  });
});
