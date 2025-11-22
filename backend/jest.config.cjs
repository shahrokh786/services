module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./tests/env.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    '!node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};