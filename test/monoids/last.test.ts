import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'
import { Last } from '../../src/monoids/last.js'

describe('Last', () => {
  test('returns Nothing for empty and keeps the last Just value', () => {
    expect(Last.empty<number>().tag).toBe('Nothing')
    expect(
      Last.concat(Maybe.Just(1), Maybe.Just(2)).fold(
        () => 0,
        (value) => value
      )
    ).toBe(2)
    expect(
      Last.concat(Maybe.Just(1), Maybe.Nothing()).fold(
        () => 0,
        (value) => value
      )
    ).toBe(1)
  })

  test('provides convenience constructors backed by Maybe', () => {
    expect(
      Last.of(1).fold(
        () => 0,
        (value) => value
      )
    ).toBe(1)
    expect(
      Last.fromNullable(2).fold(
        () => 0,
        (value) => value
      )
    ).toBe(2)
    expect(Last.fromNullable(null).tag).toBe('Nothing')
  })
})
