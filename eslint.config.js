import tsParser from '@typescript-eslint/parser';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['src/**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Browser APIs used by this application; built-in JS globals are automatic.
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        setTimeout: 'readonly',
      },
    },
    // Keep correctness checks separate from Prettier's layout rules.
    rules: {
      'no-undef': 'error',
      'no-debugger': 'error',
      'no-unreachable': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: { parser: tsParser },
    // TypeScript checks names, including type-only names such as Record.
    rules: { 'no-undef': 'off' },
  },
];
