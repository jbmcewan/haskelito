import { describe, expect, test } from 'vitest'

import { Stream } from '../../src/collections/stream.js'

describe('Stream', () => {
  describe('iterate', () => {
    test('creates an infinite generator from a seed and step function', () => {
      const numbers = Stream.iterate((value) => value + 2, 0)()

      expect(numbers.next().value).toBe(0)
      expect(numbers.next().value).toBe(2)
      expect(numbers.next().value).toBe(4)
    })
  })
})
