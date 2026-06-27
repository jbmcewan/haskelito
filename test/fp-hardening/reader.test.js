import { describe, expect, test } from 'vitest'

import { Reader } from '../../src/monads/reader.js'

describe('Reader hardening', () => {
  test('produced values are immutable', () => {
    expect(Object.isFrozen(Reader.of(1))).toBe(true)
  })
})
