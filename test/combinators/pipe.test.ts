import { describe, expect, test } from 'vitest'

import { pipe } from '../../src/combinators/pipe.js'

describe('pipe', () => {
  test('applies functions from left to right', () => {
    const result = pipe(
      2,
      (value: unknown) => (value as number) + 1,
      (value: unknown) => (value as number) * 3
    ) as number

    expect(result).toBe(9)
  })
})
