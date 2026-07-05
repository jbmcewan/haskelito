import { describe, expect, test } from 'vitest'

import { Effect } from '../../src/monads/effect.js'

describe('Effect laws', () => {
  describe('Monad', () => {
    test('satisfies left identity, right identity, and associativity', async () => {
      const effectF = (value: number) => Effect.of(value + 1)
      const effectG = (value: number) => Effect.of(value * 2)
      const value = 3
      const m = Effect.of(value)

      await expect(Effect.of(value).flatMap(effectF).run()).resolves.toBe(
        await effectF(value).run()
      )
      await expect(m.flatMap(Effect.of).run()).resolves.toBe(await m.run())
      await expect(m.flatMap(effectF).flatMap(effectG).run()).resolves.toBe(
        await m.flatMap((x) => effectF(x).flatMap(effectG)).run()
      )
    })
  })
})
