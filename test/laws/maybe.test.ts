import { describe, expect, test } from 'vitest'

import { Maybe } from '../../src/adt/maybe.js'

const toMaybeView = (value: {
  fold: <U>(onNothing: () => U, onJust: (inner: unknown) => U) => U
}) =>
  value.fold(
    () => ({ tag: 'Nothing' }),
    (inner: unknown) => ({ tag: 'Just', value: inner })
  )

describe('Maybe laws', () => {
  describe('Functor', () => {
    const identity = (value: number) => value
    const add1 = (value: number) => value + 1
    const times2 = (value: number) => value * 2

    test('satisfies identity and composition', () => {
      const maybe = Maybe.Just(2)

      expect(toMaybeView(maybe.map(identity))).toEqual(toMaybeView(maybe))
      expect(toMaybeView(maybe.map((value) => times2(add1(value))))).toEqual(
        toMaybeView(maybe.map(add1).map(times2))
      )
    })
  })

  describe('Monad', () => {
    const maybeF = (value: number) => Maybe.of(value + 1)
    const maybeG = (value: number) => Maybe.of(value * 2)

    test('satisfies left identity, right identity, and associativity', () => {
      const value = 2
      const m = Maybe.of(value)

      expect(toMaybeView(Maybe.of(value).flatMap(maybeF))).toEqual(toMaybeView(maybeF(value)))
      expect(toMaybeView(m.flatMap((x) => Maybe.of(x)))).toEqual(toMaybeView(m))
      expect(toMaybeView(m.flatMap(maybeF).flatMap(maybeG))).toEqual(
        toMaybeView(m.flatMap((x) => maybeF(x).flatMap(maybeG)))
      )
    })
  })
})
