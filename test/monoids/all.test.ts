import { describe, expect, test } from 'vitest'

import { All } from '../../src/monoids/all.js'

describe('All', () => {
  test('provides boolean identity and conjunction', () => {
    expect(All.empty()).toBe(true)
    expect(All.concat(true, false)).toBe(false)
  })
})
