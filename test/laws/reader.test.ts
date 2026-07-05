import { describe, expect, test } from 'vitest'

import { Reader } from '../../src/monads/reader.js'

const ReaderAny = Reader as any

describe('Reader laws', () => {
  describe('Functor', () => {
    const identity = (value: number) => value
    const add1 = (value: number) => value + 1
    const times2 = (value: number) => value * 2

    test('satisfies identity and composition', () => {
      const reader = ReaderAny((env: unknown) => (env as { base: number }).base)

      expect(reader.map(identity).run({ base: 2 })).toBe(reader.run({ base: 2 }))
      expect(reader.map((value: number) => times2(add1(value))).run({ base: 2 })).toBe(
        reader.map(add1).map(times2).run({ base: 2 })
      )
    })
  })

  describe('Monad', () => {
    test('satisfies left identity, right identity, and associativity', () => {
      const readerF = (value: number) =>
        ReaderAny((env: unknown) => value + (env as { delta: number; factor: number }).delta)
      const readerG = (value: number) =>
        ReaderAny((env: unknown) => value * (env as { delta: number; factor: number }).factor)
      const value = 3
      const env = { delta: 2, factor: 4 }
      const m = ReaderAny.of(value)

      expect(ReaderAny.of(value).flatMap(readerF).run(env)).toBe(readerF(value).run(env))
      expect(m.flatMap(Reader.of).run(env)).toBe(m.run(env))
      expect(m.flatMap(readerF).flatMap(readerG).run(env)).toBe(
        m.flatMap((x: number) => readerF(x).flatMap(readerG)).run(env)
      )
    })
  })
})
