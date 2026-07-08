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
      expect(result.flatMap(() => result).tag).toBe('Left')
      expect(
        result.fold(
          (error) => error,
          () => 'ok'
        )
      ).toBe('boom')
    })
  })

  describe('mapLeft', () => {
    test('maps over Left values', () => {
      const result = Either.mapLeft((error: string) => error.toUpperCase(), Either.Left('boom'))

      expect(
        result.fold(
          (error) => error,
          () => 'ok'
        )
      ).toBe('BOOM')
    })

    test('preserves Right values', () => {
      const result = Either.mapLeft((error: string) => error.toUpperCase(), Either.Right(3))

      expect(
        result.fold(
          () => 0,
          (value) => value
        )
      ).toBe(3)
    })
  })

  describe('bimap', () => {
    test('maps the left branch', () => {
      const result = Either.bimap(
        (error: string) => error.toUpperCase(),
        (value: number) => value * 2,
        Either.Left('boom')
      )

      expect(
        result.fold(
          (error) => error,
          () => 'ok'
        )
      ).toBe('BOOM')
    })

    test('maps the right branch', () => {
      const result = Either.bimap(
        (error: string) => error.toUpperCase(),
        (value: number) => value * 2,
        Either.Right(3)
      )

      expect(
        result.fold(
          () => 0,
          (value) => value
        )
      ).toBe(6)
    })
  })

  describe('fromThrowable', () => {
    test('captures thrown errors', () => {
      const result = Either.fromThrowable(
        () => {
          throw new Error('bad input')
        },
        (error) => (error instanceof Error ? error.message : String(error))
      )

      expect(
        result.fold(
          (error) => error,
          () => 'ok'
        )
      ).toBe('bad input')
    })

    test('returns Right for successful execution', () => {
      const result = Either.fromThrowable(
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

  describe('tryCatch alias', () => {
    test('is an alias of fromThrowable for backward compatibility', () => {
      expect(Either.tryCatch).toBe(Either.fromThrowable)
    })

    test('preserves previous behavior through alias', () => {
      const result = Either.tryCatch(
        () => {
          throw new Error('legacy path')
        },
        (error) => (error instanceof Error ? error.message : String(error))
      )

      expect(
        result.fold(
          (error) => error,
          () => 'ok'
        )
      ).toBe('legacy path')
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
