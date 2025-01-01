module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapper: {
    '^@react-native-firebase/auth$': '<rootDir>/src/__mocks__/@react-native-firebase/auth.ts',
    '^@react-native-google-signin/google-signin$': '<rootDir>/src/__mocks__/@react-native-google-signin/google-signin.ts'
  },
  setupFiles: ['<rootDir>/src/setupTests.ts']
};
