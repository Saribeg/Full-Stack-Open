import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import vitest from 'eslint-plugin-vitest';
import cypress from 'eslint-plugin-cypress';

const commonRules = {
  'stylistic/indent': ['error', 2],
  'stylistic/semi': ['error', 'always'],
  'stylistic/quotes': ['error', 'single'],
  'stylistic/linebreak-style': ['error', 'unix'],
  'stylistic/object-curly-spacing': ['error', 'always'],
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'error',
  'react/jsx-uses-react': 'off',
  'react/jsx-uses-vars': 'error',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  eqeqeq: 'error',
  'no-console': 'warn',
  'no-trailing-spaces': 'error',
  'arrow-spacing': ['error', { before: true, after: true }],
};

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: Object.fromEntries(
        Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
      ),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      stylistic,
      react,
      'react-hooks': reactHooks,
    },
    rules: commonRules,
  },
  {
    files: ['tests/**/*.test.{js,jsx}', 'tests/setupTests.js', 'tests/utils/contextTestUtils.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
        ...(vitest.environments?.env?.globals ?? {}),
      },
    },
    plugins: {
      vitest,
    },
    rules: {
      ...commonRules,
      'react/prop-types': 'off',
      'no-empty-pattern': 'off',
    },
  },
  {
    files: ['tests/e2e/**/*.cy.{js,jsx,ts,tsx}'],
    ...cypress.configs.globals,
  },
  {
    files: ['tests/e2e/support/**/*.{js,jsx,ts,tsx}'],
    ...cypress.configs.globals,
  },
  {
    files: [
      'cypress.config.{js,ts}',
      'vite.config.{js,ts}',
      'eslint.config.{js,cjs}'
    ],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    ignores: ['dist/**'],
  },
];
