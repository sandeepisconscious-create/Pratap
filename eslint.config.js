import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
  {
    plugins: {
      prettier
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        setTimeout: 'readonly',
        getComputedStyle: 'readonly',
        process: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      ...configPrettier.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prettier/prettier': 'error'
    }
  }
];
