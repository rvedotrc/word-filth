module.exports = {
  root: true,
  ignorePatterns: [
  //   "**/jest.config.js",
    "**/*.test.js*",
    "**/*.test.ts*",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "no-shadow": 1,
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/explicit-module-boundary-types": ["error"],
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-empty-function": "off"
  }
};
