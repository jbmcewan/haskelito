import { describe, expect, test } from 'vitest'

import { Either } from '../../src/adt/either.js'

const toEitherView = (value: {
  fold: <U>(onLeft: (inner: unknown) => U, onRight: (inner: unknown) => U) => U
}) =>
  value.fold(
    (inner: unknown) => ({ tag: 'Left', value: inner }),
    (inner: unknown) => ({ tag: 'Right', value: inner })
  )

describe('Either laws', () => {
  describe('Functor', () => {
    const identity = (value: number) => value
    const add1 = (value: number) => value + 1
    const times2 = (value: number) => value * 2

    test('satisfies identity and composition on Right values', () => {
      const either = Either.Right(2)

      expect(toEitherView(either.map(identity))).toEqual(toEitherView(either))
      expect(toEitherView(either.map((value) => times2(add1(value))))).toEqual(
        toEitherView(either.map(add1).map(times2))
      )
    })

    test('bimap satisfies identity and composition on both branches', () => {
      const left = Either.Left('boom')
      const right = Either.Right(2)
      const identityLeft = (value: string) => value
      const identityRight = (value: number) => value
      const appendBang = (value: string) => `${value}!`
      const wrap = (value: string) => `[${value}]`
      const composeLeft = (value: string) => wrap(appendBang(value))
      const composeRight = (value: number) => times2(add1(value))

      expect(toEitherView(Either.bimap(identityLeft, identityRight, left))).toEqual(
        toEitherView(left)
      )
      expect(toEitherView(Either.bimap(identityLeft, identityRight, right))).toEqual(
        toEitherView(right)
      )
      expect(
        toEitherView(Either.bimap(wrap, times2, Either.bimap(appendBang, add1, left)))
      ).toEqual(toEitherView(Either.bimap(composeLeft, composeRight, left)))
      expect(
        toEitherView(Either.bimap(wrap, times2, Either.bimap(appendBang, add1, right)))
      ).toEqual(toEitherView(Either.bimap(composeLeft, composeRight, right)))
    })
  })

  describe('Monad', () => {
    test('satisfies left identity, right identity, and associativity', () => {
      const eitherF = (value: number) => Either.of(value + 1)
      const eitherG = (value: number) => Either.of(value * 2)
      const value = 3
      const m = Either.of(value)

      expect(toEitherView(Either.of(value).flatMap(eitherF))).toEqual(toEitherView(eitherF(value)))
      expect(toEitherView(m.flatMap((x) => Either.of(x)))).toEqual(toEitherView(m))
      expect(toEitherView(m.flatMap(eitherF).flatMap(eitherG))).toEqual(
        toEitherView(m.flatMap((x) => eitherF(x).flatMap(eitherG)))
      )
    })
  })

  describe('Left mapping helpers', () => {
    test('mapLeft satisfies identity and composition on Left values and preserves Right values', () => {
      const left = Either.Left('boom')
      const right = Either.Right(2)
      const identity = (value: string) => value
      const appendBang = (value: string) => `${value}!`
      const wrap = (value: string) => `[${value}]`

      expect(toEitherView(Either.mapLeft(identity, left))).toEqual(toEitherView(left))
      expect(toEitherView(Either.mapLeft(appendBang, right))).toEqual(toEitherView(right))
      expect(toEitherView(Either.mapLeft(wrap, Either.mapLeft(appendBang, left)))).toEqual(
        toEitherView(Either.mapLeft((value) => wrap(appendBang(value)), left))
      )
    })
  })
})
