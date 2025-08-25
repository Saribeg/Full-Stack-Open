import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import vitest from 'eslint-plugin-vitest';
import prettier from 'eslint-plugin-prettier';
import vitestGlobals from 'eslint-config-vitest-globals/flat';

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
  'prettier/prettier': 'error'
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
    files: ['tests/**/*.test.{js,jsx}', 'tests/setupTests.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
        ...vitestGlobals().languageOptions.globals
      }
    },
    plugins: {
      vitest
    },
    rules: Object.assign(commonRules, {
      'react/prop-types': 'off',
      'no-empty-pattern': 'off',
      'no-console': 'off'
    })
  },
  {
    files: [
      'playwright.config.{js,ts}',
      'vite.config.{js,ts}',
      'eslint.config.{js,cjs}',
      'tailwind.config.{js,cjs}',
      'postcss.config.{js,cjs}'
    ],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    ignores: ['dist/**']
  }
];
