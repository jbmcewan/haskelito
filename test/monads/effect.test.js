import { describe, expect, test } from 'vitest'

import { Effect } from '../../src/monads/effect.js'

describe('Effect', () => {
  describe('of', () => {
    test('lifts a resolved promise into an effect', async () => {
      await expect(Effect.of(4).run()).resolves.toBe(4)
    })
  })

  describe('tryCatch', () => {
    test('resolves successful thunks', async () => {
      await expect(
        Effect.tryCatch(
          () => 'done',
          () => 'ignored'
        ).run()
      ).resolves.toBe('done')
    })

    test('maps thrown errors through the error handler', async () => {
      await expect(
        Effect.tryCatch(
          () => {
            throw new Error('bad input')
          },
          (error) => error.message
        ).run()
      ).resolves.toBe('bad input')
    })
  })

  describe('map', () => {
    test('transforms the resolved value', async () => {
      await expect(
        Effect.of(2)
          .map((value) => value + 3)
          .run()
      ).resolves.toBe(5)
    })
  })

  describe('flatMap', () => {
    test('chains effects sequentially', async () => {
      const effect = Effect.of(2)
        .flatMap((value) => Effect.of(value + 1))
        .flatMap((value) => Effect.of(value * 3))

      await expect(effect.run()).resolves.toBe(9)
    })
  })
})
