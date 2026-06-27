import { describe, expect, test } from 'vitest'

import { Reader } from '../../src/monads/reader.js'

describe('Reader', () => {
  describe('Reader', () => {
    test('creates a runnable reader and maps over the result', () => {
      const reader = Reader((env) => env.greeting).map((value) => value.toUpperCase())

      expect(reader.run({ greeting: 'hello' })).toBe('HELLO')
    })

    test('flatMaps by reusing the same environment', () => {
      const reader = Reader((env) => env.base).flatMap((base) =>
        Reader((env) => base + env.suffix)
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
})
