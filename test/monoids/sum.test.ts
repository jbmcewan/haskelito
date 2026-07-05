import { describe, expect, test } from 'vitest'

import { Sum } from '../../src/monoids/sum.js'

describe('Sum', () => {
  test('provides additive identity and concatenation', () => {
    expect(Sum.empty()).toBe(0)
    expect(Sum.concat(10, 20)).toBe(30)
  })
})
