import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'
import { Last } from '../../src/monoids/last.js'

const toMaybeView = <T>(value: ReturnType<typeof Last.empty<T>>) =>
  value.fold<{ tag: 'Nothing' } | { tag: 'Just'; value: T }>(
    () => ({ tag: 'Nothing' as const }),
    (inner) => ({ tag: 'Just' as const, value: inner })
  )

describe('Last laws', () => {
  test('is associative with identity', () => {
    const a = Maybe.Just(1)
    const b = Maybe.Nothing()
    const c = Maybe.Just(3)

    expect(toMaybeView(Last.concat(Last.empty<number>(), a))).toEqual(toMaybeView(a))
    expect(toMaybeView(Last.concat(a, Last.empty<number>()))).toEqual(toMaybeView(a))
    expect(toMaybeView(Last.concat(Last.concat(a, b), c))).toEqual(
      toMaybeView(Last.concat(a, Last.concat(b, c)))
    )
  })
})
