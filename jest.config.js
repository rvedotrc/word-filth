module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  "setupFilesAfterEnv": [
    "<rootDir>/src/jest-setup.js"
  ],
};
