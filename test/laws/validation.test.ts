import { describe, expect, test } from 'vitest'

import { Validation } from '../../src/adt/validation.js'

const toValidationView = (value: {
  fold: <U>(onFailure: (inner: unknown) => U, onSuccess: (inner: unknown) => U) => U
}) =>
  value.fold(
    (inner: unknown) => ({ tag: 'Failure', value: inner }),
    (inner: unknown) => ({ tag: 'Success', value: inner })
  )

describe('Validation laws', () => {
  describe('Applicative', () => {
    test('satisfies identity, homomorphism, interchange, and composition', () => {
      const identity = (value: number) => value
      const u = Validation.of((value: number) => value + 1)
      const v = Validation.of((value: number) => value * 2)
      const w = Validation.of(10)
      const value = 7

      expect(toValidationView(Validation.of(identity).ap(w))).toEqual(toValidationView(w))
      expect(
        toValidationView(Validation.of((x: number) => x + 1).ap(Validation.of(value)))
      ).toEqual(toValidationView(Validation.of(((x: number) => x + 1)(value))))
      expect(toValidationView(u.ap(Validation.of(value)))).toEqual(
        toValidationView(Validation.of((f: (input: number) => number) => f(value)).ap(u))
      )
      expect(
        toValidationView(
          Validation.of(
            (f: (value: number) => number) => (g: (value: number) => number) => (x: number) =>
              f(g(x))
          )
            .ap(u)
            .ap(v)
            .ap(w)
        )
      ).toEqual(toValidationView(u.ap(v.ap(w))))
    })
  })
})
