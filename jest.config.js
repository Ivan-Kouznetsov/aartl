module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*fixtures.ts',
    '!src/**/*.d.ts',
    '!<rootDir>/src/__tests__/**/*.ts',
    '!src/lib/**/*.ts',
  ],
};
