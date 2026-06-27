import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'
import { chain, flatMap } from '../../src/combinators/chain.js'

describe('chain', () => {
  test('delegates to flatMap on monadic values', () => {
    const result = chain((value) => Maybe.Just(value + 5), Maybe.Just(2))

    expect(
      result.fold(
        () => 0,
        (value) => value
      )
    ).toBe(7)
  })
})

describe('flatMap', () => {
  test('is the exported alias for chain', () => {
    const result = flatMap((value) => Maybe.Just(value * 4), Maybe.Just(3))

    expect(
      result.fold(
        () => 0,
        (value) => value
      )
    ).toBe(12)
  })
})
