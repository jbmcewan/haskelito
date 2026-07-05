import { describe, expect, test } from 'vitest'

import { Any } from '../../src/monoids/any.js'

describe('Any', () => {
  test('provides boolean identity and disjunction', () => {
    expect(Any.empty()).toBe(false)
    expect(Any.concat(false, false)).toBe(false)
    expect(Any.concat(false, true)).toBe(true)
  })
})
