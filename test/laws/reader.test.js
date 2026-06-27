import { describe, expect, test } from 'vitest'

import { Reader } from '../../src/monads/reader.js'

describe('Reader laws', () => {
  describe('Functor', () => {
    const identity = (value) => value
    const add1 = (value) => value + 1
    const times2 = (value) => value * 2

    test('satisfies identity and composition', () => {
      const reader = Reader((env) => env.base)

      expect(reader.map(identity).run({ base: 2 })).toBe(reader.run({ base: 2 }))
      expect(reader.map((value) => times2(add1(value))).run({ base: 2 })).toBe(
        reader.map(add1).map(times2).run({ base: 2 })
      )
    })
  })

  describe('Monad', () => {
    test('satisfies left identity, right identity, and associativity', () => {
      const readerF = (value) => Reader((env) => value + env.delta)
      const readerG = (value) => Reader((env) => value * env.factor)
      const value = 3
      const env = { delta: 2, factor: 4 }
      const m = Reader.of(value)

      expect(Reader.of(value).flatMap(readerF).run(env)).toBe(readerF(value).run(env))
      expect(m.flatMap(Reader.of).run(env)).toBe(m.run(env))
      expect(m.flatMap(readerF).flatMap(readerG).run(env)).toBe(
        m.flatMap((x) => readerF(x).flatMap(readerG)).run(env)
      )
    })
  })
})
