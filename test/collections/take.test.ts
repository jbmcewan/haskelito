import { describe, expect, test } from 'vitest'

import { Stream } from '../../src/collections/stream.js'
import { take } from '../../src/collections/take.js'

describe('take', () => {
  test('collects the requested number of values from a generator', () => {
    const evens = Stream.iterate((value) => value + 2, 0)

    expect(take(5, evens)).toEqual([0, 2, 4, 6, 8])
  })

  test('stops when the generator ends early', () => {
    const finite = function* () {
      yield 1
      yield 2
    }

    expect(take(5, finite)).toEqual([1, 2])
  })

  test('throws for invalid inputs', () => {
    expect(() =>
      take(
        -1,
        Stream.iterate((value) => value + 1, 0)
      )
    ).toThrow('take expects count to be a non-negative integer')
    expect(() => take(2, null)).toThrow('take expects a generator factory function')
    expect(() => take(2, () => ({ nope: true }))).toThrow(
      'take expects generatorFactory to return an iterator'
    )
  })
})
