import { describe, expect, test } from 'vitest'

import { All } from '../../src/monoids/all.js'

describe('All laws', () => {
  test('is associative with identity', () => {
    expect(All.concat(All.empty(), false)).toBe(false)
    expect(All.concat(false, All.empty())).toBe(false)
    expect(All.concat(All.concat(true, false), true)).toBe(
      All.concat(true, All.concat(false, true))
    )
  })
})
