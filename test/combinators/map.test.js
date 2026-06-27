import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'
import { map } from '../../src/combinators/map.js'

describe('map', () => {
  test('delegates to a functor map method', () => {
    const doubled = map((value) => value * 2, Maybe.Just(4))

    expect(
      doubled.fold(
        () => 0,
        (value) => value
      )
    ).toBe(8)
  })
})
