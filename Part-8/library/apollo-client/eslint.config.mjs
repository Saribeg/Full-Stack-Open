import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  js.configs.recommended,

  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      stylistic,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: '18.2',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'stylistic/indent': ['error', 2],
      'stylistic/semi': ['error', 'always'],
      'stylistic/quotes': ['error', 'single'],
      'stylistic/linebreak-style': ['error', 'unix'],
      'stylistic/object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-trailing-spaces': 'error',
      eqeqeq: 'error',
      'no-console': 'error',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
    },
  },

  {
    files: ['**/logger.js'],
    rules: {
      'no-console': 'off',
    },
  },

  {
    ignores: ['dist/**'],
  },
];