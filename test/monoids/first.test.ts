import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'
import { First } from '../../src/monoids/first.js'

describe('First', () => {
  test('returns Nothing for empty and keeps the first Just value', () => {
    expect(First.empty<number>().tag).toBe('Nothing')
    expect(
      First.concat(Maybe.Just(1), Maybe.Just(2)).fold(
        () => 0,
        (value) => value
      )
    ).toBe(1)
    expect(
      First.concat(Maybe.Nothing(), Maybe.Just(2)).fold(
        () => 0,
        (value) => value
      )
    ).toBe(2)
  })

  test('provides convenience constructors backed by Maybe', () => {
    expect(
      First.of(1).fold(
        () => 0,
        (value) => value
      )
    ).toBe(1)
    expect(
      First.fromNullable(2).fold(
        () => 0,
        (value) => value
      )
    ).toBe(2)
    expect(First.fromNullable(null).tag).toBe('Nothing')
  })
})
