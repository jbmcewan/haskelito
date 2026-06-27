import { describe, expect, test } from 'vitest'

import { Either } from '../../src/adt/either.js'

const toEitherView = (value) =>
  value.fold(
    (inner) => ({ tag: 'Left', value: inner }),
    (inner) => ({ tag: 'Right', value: inner })
  )

describe('Either laws', () => {
  describe('Functor', () => {
    const identity = (value) => value
    const add1 = (value) => value + 1
    const times2 = (value) => value * 2

    test('satisfies identity and composition on Right values', () => {
      const either = Either.Right(2)

      expect(toEitherView(either.map(identity))).toEqual(toEitherView(either))
      expect(toEitherView(either.map((value) => times2(add1(value))))).toEqual(
        toEitherView(either.map(add1).map(times2))
      )
    })
  })

  describe('Monad', () => {
    test('satisfies left identity, right identity, and associativity', () => {
      const eitherF = (value) => Either.of(value + 1)
      const eitherG = (value) => Either.of(value * 2)
      const value = 3
      const m = Either.of(value)

      expect(toEitherView(Either.of(value).flatMap(eitherF))).toEqual(
        toEitherView(eitherF(value))
      )
      expect(toEitherView(m.flatMap(Either.of))).toEqual(toEitherView(m))
      expect(toEitherView(m.flatMap(eitherF).flatMap(eitherG))).toEqual(
        toEitherView(m.flatMap((x) => eitherF(x).flatMap(eitherG)))
      )
    })
  })
})
