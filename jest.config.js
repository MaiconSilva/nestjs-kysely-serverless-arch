/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  testTimeout: 30000,
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'node',
      roots: ['<rootDir>/packages', '<rootDir>/modules'],
      testMatch: ['**/*.spec.ts'],
      // *.int.spec.ts also ends in .spec.ts; keep integration-only files out of unit runs.
      testPathIgnorePatterns: [
        '/node_modules/',
        '\\.int\\.spec\\.ts$',
        '/\\.build/',
        '/modules/packages/',
      ],
      transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.base.json' }],
      },
      moduleNameMapper: {
        '^@todolist/shared$': '<rootDir>/packages/shared/src',
        '^@todolist/shared/(.*)$': '<rootDir>/packages/shared/src/$1',
      },
      collectCoverageFrom: [
        'packages/**/src/**/*.ts',
        'modules/**/src/**/*.ts',
        '!**/*.spec.ts',
        '!**/dist/**',
      ],
      coverageThreshold: {
        './packages/shared/src/domain/': { branches: 70, functions: 80, lines: 80, statements: 80 },
        './modules/activities/src/domain/': { branches: 80, functions: 90, lines: 85, statements: 85 },
      },
    },
    {
      displayName: 'integration',
      testEnvironment: 'node',
      roots: ['<rootDir>/packages', '<rootDir>/modules'],
      testMatch: ['**/*.int.spec.ts'],
      testPathIgnorePatterns: ['/node_modules/', '/\\.build/', '/modules/packages/'],
      transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.base.json' }],
      },
      moduleNameMapper: {
        '^@todolist/shared$': '<rootDir>/packages/shared/src',
        '^@todolist/shared/(.*)$': '<rootDir>/packages/shared/src/$1',
      },
    },
  ],
};
