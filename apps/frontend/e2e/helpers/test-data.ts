/**
 * Test data helpers and utilities for E2E tests
 */

/**
 * Generate a unique email for testing
 */
export function generateUniqueEmail(prefix: string = 'test'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}.${timestamp}.${random}@example.com`;
}

/**
 * Generate a test user with unique email
 */
export function generateTestUser(name: string = 'Test User') {
  return {
    name,
    email: generateUniqueEmail('e2e'),
    password: 'TestPassword123!',
  };
}

/**
 * Common test credentials
 * Note: These should exist in your test database
 */
export const TEST_USERS = {
  existing: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  },
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
  },
};

/**
 * Common selectors used across multiple tests
 */
export const SELECTORS = {
  login: {
    emailInput: 'input#email',
    passwordInput: 'input[type="password"]',
    submitButton: 'button[type="submit"]',
    registerLink: 'a[href="/register"]',
    errorMessage: '.p-message',
    title: 'h1',
  },
  register: {
    nameInput: 'input[placeholder="Name"]',
    emailInput: 'input[placeholder="Email"]',
    passwordInput: 'input[type="password"]',
    submitButton: 'button[type="submit"]',
    loginLink: 'a[href="/login"]',
    errorMessage: '.p-error',
    title: 'h1',
  },
  common: {
    card: 'p-card',
    form: 'form',
    appRoot: 'tb-root',
  },
};

/**
 * Wait times for various operations
 */
export const TIMEOUTS = {
  navigation: 10000,
  apiCall: 5000,
  short: 2000,
};

/**
 * Board page selectors
 */
export const BOARD_SELECTORS = {
  header: {
    container: 'header.header',
    title: 'h1',
    addTaskButton: 'button[aria-label*="Add"], p-button[icon="pi pi-plus"]',
    taskCounter: '.header__tasks-badge',
    userMenuButton: '.header__user',
    userMenu: 'p-menu',
    themeToggle: 'tb-common-theme-toggle',
  },
  menu: {
    languageOption: 'button:has-text("Language"), .p-menuitem:has-text("Language")',
    polishOption: 'button:has-text("Polish"), .p-menuitem:has-text("Polish")',
    englishOption: 'button:has-text("English"), .p-menuitem:has-text("English")',
    logoutOption: 'button:has-text("Logout"), .p-menuitem:has-text("Logout")',
  },
  board: {
    container: '.board',
    main: '.board__main',
    filters: 'tb-filters',
    userTasks: 'tb-user-tasks',
    emptyState: '.empty-state',
    tasksList: '.grid',
    task: 'tb-task',
    loadingState: '.loading-state',
  },
};

/**
 * Task dialog selectors
 */
export const TASK_DIALOG_SELECTORS = {
  dialog: 'p-dynamicdialog, p-dialog, .p-dialog',
  dialogHeader: '.p-dialog-header, .p-dialog-title',
  form: 'form.task-dialog-form',
  inputs: {
    title: 'input#title',
    assignedTo: 'p-select#assignedTo, #assignedTo',
    priority: 'p-select#priority, #priority',
    status: 'p-select#status, #status',
  },
  labels: {
    title: 'label[for="title"]',
    assignedTo: 'label[for="assignedTo"]',
    priority: 'label[for="priority"]',
    status: 'label[for="status"]',
  },
  buttons: {
    cancel: 'button:has-text("Cancel"), button:has-text("Anuluj")',
    save: 'button:has-text("Save"), button:has-text("Zapisz")',
  },
  validation: {
    errorMessage: 'small.error-message',
    requiredMark: '.required',
  },
  dropdown: {
    panel: '.p-select-overlay, .p-dropdown-panel',
    option: '.p-select-option, .p-dropdown-item',
  },
};
