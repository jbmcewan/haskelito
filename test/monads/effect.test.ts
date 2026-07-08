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
          (error) => (error instanceof Error ? error.message : String(error))
        ).run()
      ).resolves.toBe('bad input')
    })
  })

  describe('ensuring', () => {
    test('runs finalizer after successful effect', async () => {
      let finalized = false

      const effect = Effect.ensuring(Effect.of('done'), () => {
        finalized = true
      })

      await expect(effect.run()).resolves.toBe('done')
      expect(finalized).toBe(true)
    })

    test('runs finalizer after failed effect', async () => {
      let finalized = false

      const failed = Effect.tryCatch(
        () => {
          throw new Error('boom')
        },
        (error) => {
          throw error
        }
      )

      const effect = Effect.ensuring(failed, () => {
        finalized = true
      })

      await expect(effect.run()).rejects.toThrow('boom')
      expect(finalized).toBe(true)
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

  describe('bracket', () => {
    test('returns use result and always releases resource on success', async () => {
      let released: number | null = null

      const effect = Effect.bracket(
        () => 21,
        (resource) => resource * 2,
        (resource) => {
          released = resource
        }
      )

      await expect(effect.run()).resolves.toBe(42)
      expect(released).toBe(21)
    })

    test('releases resource when use fails', async () => {
      let released: number | null = null

      const effect = Effect.bracket(
        () => 7,
        () => {
          throw new Error('use failed')
        },
        (resource) => {
          released = resource
        }
      )

      await expect(effect.run()).rejects.toThrow('use failed')
      expect(released).toBe(7)
    })

    test('does not release when acquire fails', async () => {
      let released = false

      const effect = Effect.bracket(
        () => {
          throw new Error('acquire failed')
        },
        () => 'unused',
        () => {
          released = true
        }
      )

      await expect(effect.run()).rejects.toThrow('acquire failed')
      expect(released).toBe(false)
    })
  })
})
