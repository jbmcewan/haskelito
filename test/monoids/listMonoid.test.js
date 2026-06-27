import { describe, expect, test } from 'vitest'

import { ListMonoid } from '../../src/monoids/listMonoid.js'

describe('ListMonoid', () => {
  test('provides list identity and concatenation', () => {
    expect(ListMonoid.empty()).toEqual([])
    expect(ListMonoid.concat([1], [2, 3])).toEqual([1, 2, 3])
  })
})
