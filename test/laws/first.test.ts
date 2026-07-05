import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'
import { First } from '../../src/monoids/first.js'

const toMaybeView = <T>(value: ReturnType<typeof First.empty<T>>) =>
  value.fold<{ tag: 'Nothing' } | { tag: 'Just'; value: T }>(
    () => ({ tag: 'Nothing' as const }),
    (inner) => ({ tag: 'Just' as const, value: inner })
  )

describe('First laws', () => {
  test('is associative with identity', () => {
    const a = Maybe.Just(1)
    const b = Maybe.Nothing()
    const c = Maybe.Just(3)

    expect(toMaybeView(First.concat(First.empty<number>(), a))).toEqual(toMaybeView(a))
    expect(toMaybeView(First.concat(a, First.empty<number>()))).toEqual(toMaybeView(a))
    expect(toMaybeView(First.concat(First.concat(a, b), c))).toEqual(
      toMaybeView(First.concat(a, First.concat(b, c)))
    )
  })
})
