import { describe, expect, test } from 'vitest'

import { Validation } from '../../src/adt/validation.js'

describe('Validation', () => {
  describe('Success', () => {
    test('maps and applies functions to successful values', () => {
      const result = Validation.Success(2).map((value) => value + 3)

      expect(result.tag).toBe('Success')
      expect(
        result.fold(
          () => 0,
          (value) => value
        )
      ).toBe(5)
    })

    test('applies a wrapped function when the argument is also successful', () => {
      const result = Validation.Success((value: number) => value * 3).ap(Validation.Success(4))

      expect(
        result.fold(
          () => 0,
          (value) => value
        )
      ).toBe(12)
    })
  })

  describe('Failure', () => {
    test('preserves failures through map and fold', () => {
      const result = Validation.Failure(['bad'])

      expect(result.tag).toBe('Failure')
      expect(result.map((value) => value + 1).tag).toBe('Failure')
      expect(
        result.fold(
          (errors) => errors.join(','),
          () => 'ok'
        )
      ).toBe('bad')
    })

    test('accumulates failure values when applied to another failure', () => {
      const result = Validation.Failure(['left']).ap(Validation.Failure(['right']))

      expect(
        result.fold(
          (errors) => errors,
          () => [] as string[]
        )
      ).toEqual(['left', 'right'])
    })
  })

  describe('of', () => {
    test('is an alias for Success', () => {
      const result = Validation.of(6)

      expect(result.tag).toBe('Success')
      expect(
        result.fold(
          () => 0,
          (value) => value
        )
      ).toBe(6)
    })
  })
})
