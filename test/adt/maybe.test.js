import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'

describe('Maybe', () => {
  describe('Just', () => {
    test('creates a Just value with the expected tag and payload', () => {
      const maybe = Maybe.Just('hello')

      expect(maybe.tag).toBe('Just')
      expect(maybe.value).toBe('hello')
    })

    test('maps and flatMaps over the contained value', () => {
      const mapped = Maybe.Just(2).map((value) => value + 3)
      const flatMapped = Maybe.Just(2).flatMap((value) => Maybe.Just(value * 4))

      expect(
        mapped.fold(
          () => 0,
          (value) => value
        )
      ).toBe(5)
      expect(
        flatMapped.fold(
          () => 0,
          (value) => value
        )
      ).toBe(8)
    })

    test('folds and unwraps with getOrElse', () => {
      const maybe = Maybe.Just('value')

      expect(
        maybe.fold(
          () => 'missing',
          (value) => value.toUpperCase()
        )
      ).toBe('VALUE')
      expect(maybe.getOrElse('fallback')).toBe('value')
    })
  })

  describe('Nothing', () => {
    test('creates an empty value that preserves the Nothing tag', () => {
      const maybe = Maybe.Nothing()

      expect(maybe.tag).toBe('Nothing')
    })

    test('does not transform the empty value', () => {
      const maybe = Maybe.Nothing()

      expect(maybe.map((value) => value + 1).tag).toBe('Nothing')
      expect(maybe.flatMap((value) => Maybe.Just(value + 1)).tag).toBe('Nothing')
    })

    test('uses the nothing branch for fold and getOrElse', () => {
      const maybe = Maybe.Nothing()

      expect(
        maybe.fold(
          () => 'empty',
          () => 'full'
        )
      ).toBe('empty')
      expect(maybe.getOrElse('fallback')).toBe('fallback')
    })
  })

  describe('fromNullable', () => {
    test('creates Just for non-nullish values and Nothing otherwise', () => {
      expect(
        Maybe.fromNullable('hello').fold(
          () => 'empty',
          (value) => value
        )
      ).toBe('hello')
      expect(Maybe.fromNullable(null).tag).toBe('Nothing')
      expect(Maybe.fromNullable(undefined).tag).toBe('Nothing')
    })
  })

  describe('of', () => {
    test('is an alias for Just', () => {
      const maybe = Maybe.of(42)

      expect(maybe.tag).toBe('Just')
      expect(
        maybe.fold(
          () => 0,
          (value) => value
        )
      ).toBe(42)
    })
  })
})
