import { describe, expect, test } from 'vitest'

import { ListMonoid } from '../../src/monoids/listMonoid.js'

describe('ListMonoid laws', () => {
  test('is associative with identity', () => {
    expect(ListMonoid.concat(ListMonoid.empty(), [1])).toEqual([1])
    expect(ListMonoid.concat([1], ListMonoid.empty())).toEqual([1])
    expect(ListMonoid.concat(ListMonoid.concat([1], [2]), [3])).toEqual(
      ListMonoid.concat([1], ListMonoid.concat([2], [3]))
    )
  })
})
