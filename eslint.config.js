import js from '@eslint/js'
import functional from 'eslint-plugin-functional'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'docs/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
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
  {
    files: ['**/*.{ts,mts,cts}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    files: ['test/**/*.{ts,mts,cts}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'functional/no-let': 'off',
      'functional/immutable-data': 'off'
    }
  },
  prettier
]
