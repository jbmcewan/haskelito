import { describe, expect, test } from 'vitest'

import { Either } from '../../src/adt/either.js'

describe('Either hardening', () => {
  test('produced values are immutable', () => {
    expect(Object.isFrozen(Either.Right(1))).toBe(true)
  })
})
