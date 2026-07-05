import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'
import { map } from '../../src/combinators/map.js'

type FoldableNumber = {
  fold: (onNothing: () => number, onJust: (value: number) => number) => number
}

describe('map', () => {
  test('delegates to a functor map method', () => {
    const doubled = map((value: number) => value * 2, Maybe.Just(4)) as FoldableNumber

    expect(
      doubled.fold(
        () => 0,
        (value) => value
      )
    ).toBe(8)
  })
})
