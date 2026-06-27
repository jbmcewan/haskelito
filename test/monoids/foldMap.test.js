import { describe, expect, test } from 'vitest'

import { All } from '../../src/monoids/all.js'
import { ListMonoid } from '../../src/monoids/listMonoid.js'
import { Product } from '../../src/monoids/product.js'
import { Sum } from '../../src/monoids/sum.js'
import { foldMap } from '../../src/monoids/foldMap.js'

describe('foldMap', () => {
  test('reduces values using the provided monoid', () => {
    expect(foldMap(Sum, [10, 20, 30])).toBe(60)
    expect(foldMap(Product, [2, 3, 4])).toBe(24)
    expect(foldMap(All, [true, true, false])).toBe(false)
    expect(foldMap(ListMonoid, [[1], [2], [3]])).toEqual([1, 2, 3])
  })

  test('returns the monoid identity for empty inputs', () => {
    expect(foldMap(Sum, [])).toBe(0)
    expect(foldMap(Product, [])).toBe(1)
    expect(foldMap(All, [])).toBe(true)
    expect(foldMap(ListMonoid, [])).toEqual([])
  })

  test('validates boundary input', () => {
    expect(() => foldMap(Sum, null)).toThrow('foldMap expects a reducible values input')
  })
})
