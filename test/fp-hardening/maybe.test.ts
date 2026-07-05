import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'

describe('Maybe hardening', () => {
  test('produced values are immutable', () => {
    expect(Object.isFrozen(Maybe.Just(1))).toBe(true)
  })
})
