import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

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
    plugins: {
      stylistic,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'stylistic/indent': ['error', 2],
      'stylistic/semi': ['error', 'always'],
      'stylistic/quotes': ['error', 'single'],
      'stylistic/linebreak-style': ['error', 'unix'],
      'stylistic/object-curly-spacing': ['error', 'always'],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      eqeqeq: 'error',
      'no-console': 'warn',
      'no-trailing-spaces': 'error',
      'arrow-spacing': ['error', { before: true, after: true }],
    },
  },
  {
    ignores: ['dist/**'],
  },
];
