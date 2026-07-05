import { describe, expect, test } from 'vitest'

import { Reader } from '../../src/monads/reader.js'

describe('Reader', () => {
  describe('Reader', () => {
    test('creates a runnable reader and maps over the result', () => {
      const reader = (
        Reader((env: unknown) => (env as { greeting: string }).greeting) as unknown as {
          map: (fn: (value: string) => string) => { run: (env: { greeting: string }) => string }
        }
      ).map((value) => value.toUpperCase())

      expect(reader.run({ greeting: 'hello' })).toBe('HELLO')
    })

    test('flatMaps by reusing the same environment', () => {
      const reader = (
        Reader((env: unknown) => (env as { base: string; suffix: string }).base) as unknown as {
          flatMap: (
            fn: (value: string) => { run: (env: { base: string; suffix: string }) => string }
          ) => { run: (env: { base: string; suffix: string }) => string }
        }
      ).flatMap(
        (base) =>
          Reader(
            (env: unknown) => base + (env as { base: string; suffix: string }).suffix
          ) as unknown as {
            run: (env: { base: string; suffix: string }) => string
          }
      )

      expect(reader.run({ base: 'a', suffix: 'b' })).toBe('ab')
    })
  })

  describe('of', () => {
    test('lifts a fixed value into the reader context', () => {
      const reader = Reader.of('fixed')

      expect(reader.run({ anything: true })).toBe('fixed')
    })
  })

  describe('ask', () => {
    test('returns the provided environment unchanged', () => {
      const env = { greeting: 'hi' }

      expect(Reader.ask().run(env)).toBe(env)
    })
  })

  describe('asks', () => {
    test('projects a value from the environment', () => {
      const reader = Reader.asks((env: { greeting: string }) => env.greeting.toUpperCase())

      expect(reader.run({ greeting: 'hello' })).toBe('HELLO')
    })
  })

  describe('local', () => {
    test('transforms the environment before running the reader', () => {
      const reader = Reader.local(
        (env: { greeting: string }) => ({ message: env.greeting }),
        Reader((env: unknown) => (env as { message: string }).message.toUpperCase())
      )

      expect(reader.run({ greeting: 'hello' })).toBe('HELLO')
    })
  })
})
