import { describe, expect, test } from 'vitest'

import { Sum } from '../../src/monoids/sum.js'

describe('Sum laws', () => {
  test('is associative with identity', () => {
    expect(Sum.concat(Sum.empty(), 3)).toBe(3)
    expect(Sum.concat(3, Sum.empty())).toBe(3)
    expect(Sum.concat(Sum.concat(1, 2), 3)).toBe(Sum.concat(1, Sum.concat(2, 3)))
  })
})
