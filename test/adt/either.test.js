import { describe, expect, test } from 'vitest'

import { Either } from '../../src/adt/either.js'

describe('Either', () => {
  describe('Right', () => {
    test('creates a Right value and maps over it', () => {
      const result = Either.Right(3).map((value) => value + 7)

      expect(result.tag).toBe('Right')
      expect(
        result.fold(
          () => 0,
          (value) => value
        )
      ).toBe(10)
    })

    test('flatMaps and folds using the right branch', () => {
      const result = Either.Right(3).flatMap((value) => Either.Right(value * 2))

      expect(
        result.fold(
          () => 0,
          (value) => value
        )
      ).toBe(6)
    })
  })

  describe('Left', () => {
    test('creates a Left value and preserves the error through map and flatMap', () => {
      const result = Either.Left('boom')

      expect(result.tag).toBe('Left')
      expect(result.map((value) => value + 1).tag).toBe('Left')
      expect(result.flatMap((value) => Either.Right(value + 1)).tag).toBe('Left')
      expect(
        result.fold(
          (error) => error,
          () => 'ok'
        )
      ).toBe('boom')
    })
  })

  describe('tryCatch', () => {
    test('captures thrown errors', () => {
      const result = Either.tryCatch(
        () => {
          throw new Error('bad input')
        },
        (error) => error.message
      )

      expect(
        result.fold(
          (error) => error,
          () => 'ok'
        )
      ).toBe('bad input')
    })

    test('returns Right for successful execution', () => {
      const result = Either.tryCatch(
        () => 'loaded',
        () => 'ignored'
      )

      expect(
        result.fold(
          () => 'nope',
          (value) => value
        )
      ).toBe('loaded')
    })
  })

  describe('fromNullable', () => {
    test('uses the provided null handler or the default message', () => {
      expect(
        Either.fromNullable('value').fold(
          () => 'bad',
          (value) => value
        )
      ).toBe('value')
      expect(
        Either.fromNullable(null, () => 'missing').fold(
          (error) => error,
          () => 'ok'
        )
      ).toBe('missing')
      expect(
        Either.fromNullable(undefined).fold(
          (error) => error,
          () => 'ok'
        )
      ).toBe('Value was null or undefined')
    })
  })

  describe('of', () => {
    test('is an alias for Right', () => {
      const result = Either.of(9)

      expect(result.tag).toBe('Right')
      expect(
        result.fold(
          () => 0,
          (value) => value
        )
      ).toBe(9)
    })
  })
})
