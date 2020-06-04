module.exports = {
  moduleNameMapper: {
    "^lib/(.*)$": "<rootDir>/src/lib/$1"
  },
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  "setupFilesAfterEnv": [
    "<rootDir>/src/jest-setup.js"
  ],
};
