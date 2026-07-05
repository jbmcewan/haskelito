import { describe, expect, test } from 'vitest'

import { Effect } from '../../src/monads/effect.js'

describe('Effect hardening', () => {
  test('produced values are immutable', () => {
    expect(Object.isFrozen(Effect.of(1))).toBe(true)
  })
})
