import { TestBed } from '@angular/core/testing';
import { MockInstance } from 'ng-mocks';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  MockInstance.scope();

  let service: ThemeService;
  let localStorageGetItemMock: jest.Mock;
  let localStorageSetItemMock: jest.Mock;
  let addEventListenerMock: jest.Mock;
  let matchMediaMock: jest.Mock;

  beforeEach(() => {
    localStorageGetItemMock = jest.fn();
    localStorageSetItemMock = jest.fn();
    addEventListenerMock = jest.fn();
    matchMediaMock = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: addEventListenerMock,
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: localStorageGetItemMock,
        setItem: localStorageSetItemMock,
      },
      writable: true,
    });

    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true,
    });

    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
      },
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
  });

  it('should be created', () => {
    localStorageGetItemMock.mockReturnValue(null);
    service = TestBed.inject(ThemeService);

    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize theme from localStorage when savedTheme exists and is dark', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('dark');

      // Act
      service = TestBed.inject(ThemeService);

      // Assert
      expect(service.isDarkMode()).toBe(true);
    });

    it('should initialize theme from localStorage when savedTheme exists and is light', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('light');

      // Act
      service = TestBed.inject(ThemeService);

      // Assert
      expect(service.isDarkMode()).toBe(false);
    });

    it('should initialize theme from system preferences when no savedTheme exists and system prefers dark', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue(null);
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: addEventListenerMock,
      });

      // Act
      service = TestBed.inject(ThemeService);

      // Assert
      expect(service.isDarkMode()).toBe(true);
    });

    it('should initialize theme from system preferences when no savedTheme exists and system prefers light', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue(null);
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: addEventListenerMock,
      });

      // Act
      service = TestBed.inject(ThemeService);

      // Assert
      expect(service.isDarkMode()).toBe(false);
    });

    it('should apply dark class to document when initialized with dark mode', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('dark');

      // Act
      service = TestBed.inject(ThemeService);
      TestBed.flushEffects();

      // Assert
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('app-dark');
    });

    it('should remove dark class from document when initialized with light mode', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('light');

      // Act
      service = TestBed.inject(ThemeService);
      TestBed.flushEffects();

      // Assert
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('app-dark');
    });
  });

  describe('toggleDarkMode', () => {
    it('should toggle isDarkMode from false to true and save to localStorage', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('light');
      service = TestBed.inject(ThemeService);

      // Act
      service.toggleDarkMode();

      // Assert
      expect(service.isDarkMode()).toBe(true);
      expect(localStorageSetItemMock).toHaveBeenCalledWith('theme-mode', 'dark');
    });

    it('should toggle isDarkMode from true to false and save to localStorage', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('dark');
      service = TestBed.inject(ThemeService);

      // Act
      service.toggleDarkMode();

      // Assert
      expect(service.isDarkMode()).toBe(false);
      expect(localStorageSetItemMock).toHaveBeenCalledWith('theme-mode', 'light');
    });
  });

  describe('setDarkMode', () => {
    it('should set isDarkMode to true and save dark to localStorage', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('light');
      service = TestBed.inject(ThemeService);

      // Act
      service.setDarkMode(true);

      // Assert
      expect(service.isDarkMode()).toBe(true);
      expect(localStorageSetItemMock).toHaveBeenCalledWith('theme-mode', 'dark');
    });

    it('should set isDarkMode to false and save light to localStorage', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('dark');
      service = TestBed.inject(ThemeService);

      // Act
      service.setDarkMode(false);

      // Assert
      expect(service.isDarkMode()).toBe(false);
      expect(localStorageSetItemMock).toHaveBeenCalledWith('theme-mode', 'light');
    });
  });

  describe('listenToSystemPreferences', () => {
    it('should register event listener for system preferences change', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue(null);
      service = TestBed.inject(ThemeService);

      // Act
      service.listenToSystemPreferences();

      // Assert
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should update isDarkMode when system preference changes and no saved theme exists', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue(null);
      service = TestBed.inject(ThemeService);
      service.listenToSystemPreferences();

      const eventHandler = addEventListenerMock.mock.calls[0][1];

      // Act
      eventHandler({ matches: true });

      // Assert
      expect(service.isDarkMode()).toBe(true);
    });

    it('should not update isDarkMode when system preference changes but saved theme exists', () => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('light');
      service = TestBed.inject(ThemeService);
      service.listenToSystemPreferences();

      const eventHandler = addEventListenerMock.mock.calls[0][1];

      // Act
      eventHandler({ matches: true });

      // Assert
      expect(service.isDarkMode()).toBe(false);
    });
  });
});
