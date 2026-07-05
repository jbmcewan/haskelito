import { describe, expect, test } from 'vitest'

import { Product } from '../../src/monoids/product.js'

describe('Product', () => {
  test('provides multiplicative identity and concatenation', () => {
    expect(Product.empty()).toBe(1)
    expect(Product.concat(4, 5)).toBe(20)
  })
})
