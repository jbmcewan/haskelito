import { describe, expect, test } from 'vitest'

import { compose } from '../../src/combinators/compose.js'

describe('compose', () => {
  test('applies functions from right to left', () => {
    const combined = compose(
      (value) => value * 3,
      (value) => value + 1
    )

    expect(combined(2)).toBe(9)
  })
})
