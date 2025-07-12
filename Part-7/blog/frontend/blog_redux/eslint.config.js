import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import vitest from 'eslint-plugin-vitest';
import prettier from 'eslint-plugin-prettier';

const commonRules = {
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
  'prettier/prettier': 'error' // запускает Prettier как ESLint rule
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
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      prettier,
      react,
      'react-hooks': reactHooks
    },
    rules: commonRules
  },
  {
    files: ['tests/**/*.test.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
        ...vitest.environments.env.globals
      }
    },
    plugins: {
      vitest
    },
    rules: commonRules
  },
  {
    ignores: ['dist/**']
  }
];
