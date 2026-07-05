import { describe, expect, test } from 'vitest'

import { compose } from '../../src/combinators/compose.js'

describe('compose', () => {
  test('applies functions from right to left', () => {
    const combined = compose(
      (value: unknown) => (value as number) * 3,
      (value: unknown) => (value as number) + 1
    ) as (value: number) => number

    expect(combined(2)).toBe(9)
  })
})
