import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/environments/**',
    '!src/**/*.module.ts',
    '!src/**/*.model.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.type.ts',
    '!src/**/*.config.ts',
    '!src/**/*.constants.ts',
    '!src/**/*.routes.ts',
    '!src/**/index.ts',
    '!src/**/theme.ts',
    '!src/**/store/**/*.actions.ts',
    '!src/**/store/**/*.reducer.ts',
    '!src/**/store/**/*.effects.ts',
    '!src/**/store/**/*.selectors.ts',
    '!src/**/store/**/*.state.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov', 'json'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  moduleNameMapper: {
    '@team-board/shared-models': '<rootDir>/../../libs/shared-models/src/index.ts',
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@feature/(.*)': '<rootDir>/src/app/feature/$1',
    '@shared/(.*)': '<rootDir>/src/app/shared/$1',
    '@utils/(.*)': '<rootDir>/src/app/utils/$1',
    '@env/(.*)': '<rootDir>/src/app/environments/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@ngrx|@angular|rxjs|primeng|@primeuix|@ngx-translate)/)',
  ],
};

export default config;
