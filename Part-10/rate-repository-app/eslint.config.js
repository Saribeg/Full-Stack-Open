import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';

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
    files: ['App.js', 'src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      stylistic,
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
    },
    rules: {
      ...commonRules,
      'react-native/no-inline-styles': 'warn',
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-single-element-style-arrays': 'warn',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.expo/**', '.idea/**', 'babel.config.js', 'metro.config.js'],
  },
];
