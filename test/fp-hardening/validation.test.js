import { describe, expect, test } from 'vitest'

import { Validation } from '../../src/adt/validation.js'

describe('Validation hardening', () => {
  test('produced values are immutable', () => {
    expect(Object.isFrozen(Validation.Success(1))).toBe(true)
  })
})
