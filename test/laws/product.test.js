import { describe, expect, test } from 'vitest'

import { Product } from '../../src/monoids/product.js'

describe('Product laws', () => {
  test('is associative with identity', () => {
    expect(Product.concat(Product.empty(), 3)).toBe(3)
    expect(Product.concat(3, Product.empty())).toBe(3)
    expect(Product.concat(Product.concat(2, 3), 4)).toBe(
      Product.concat(2, Product.concat(3, 4))
    )
  })
})
