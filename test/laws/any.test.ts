import { describe, expect, test } from 'vitest'

import { Any } from '../../src/monoids/any.js'

describe('Any laws', () => {
  test('is associative with identity', () => {
    expect(Any.concat(Any.empty(), true)).toBe(true)
    expect(Any.concat(true, Any.empty())).toBe(true)
    expect(Any.concat(Any.concat(false, true), false)).toBe(
      Any.concat(false, Any.concat(true, false))
    )
  })
})
