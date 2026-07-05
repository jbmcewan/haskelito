import js from '@eslint/js'
import functional from 'eslint-plugin-functional'
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
      functional
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'functional/no-let': 'error',
      'functional/no-classes': 'error',
      'functional/no-this-expressions': 'error',
      'functional/immutable-data': 'error',
      'functional/no-loop-statements': 'error'
    }
  },
  prettier
]
