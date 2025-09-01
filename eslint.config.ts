// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig, // Make sure this is the last one.
  {
    // Custom rules or overrides can go here
  },
  {
    // Global ignores
    ignores: ['dist/'],
  }
);
