import { describe, expect, test } from 'vitest'

import { pipe } from '../../src/combinators/pipe.js'

describe('pipe', () => {
  test('applies functions from left to right', () => {
    const result = pipe(
      2,
      (value) => value + 1,
      (value) => value * 3
    )

    expect(result).toBe(9)
  })
})
