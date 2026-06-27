import js from '@eslint/js'
import fp from 'eslint-plugin-fp'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly'
      }
    },
    plugins: {
      fp
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'fp/no-let': 'error',
      'fp/no-class': 'error',
      'fp/no-this': 'error',
      'fp/no-mutation': 'error',
      'fp/no-mutating-assign': 'error',
      'fp/no-mutating-methods': 'error',
      'fp/no-loops': 'error'
    }
  },
  {
    files: ['test/**/*.js'],
    rules: {
      'fp/no-nil': 'off'
    }
  },
  prettier
]
