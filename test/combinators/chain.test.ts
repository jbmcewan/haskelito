import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'
import { chain, flatMap } from '../../src/combinators/chain.js'

type FoldableNumber = {
  fold: (onNothing: () => number, onJust: (value: number) => number) => number
}

describe('chain', () => {
  test('delegates to flatMap on monadic values', () => {
    const result = chain((value: number) => Maybe.Just(value + 5), Maybe.Just(2)) as FoldableNumber

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
    const result = flatMap(
      (value: number) => Maybe.Just(value * 4),
      Maybe.Just(3)
    ) as FoldableNumber

    expect(
      result.fold(
        () => 0,
        (value) => value
      )
    ).toBe(12)
  })
})
