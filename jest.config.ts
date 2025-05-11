module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.app.json',
    }],
  },
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svg.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
