import { describe, expect, test } from 'vitest'

import { Validation } from '../../src/adt/validation.js'

const toValidationView = (value) =>
  value.fold(
    (inner) => ({ tag: 'Failure', value: inner }),
    (inner) => ({ tag: 'Success', value: inner })
  )

describe('Validation laws', () => {
  describe('Applicative', () => {
    test('satisfies identity, homomorphism, interchange, and composition', () => {
      const identity = (value) => value
      const u = Validation.of((value) => value + 1)
      const v = Validation.of((value) => value * 2)
      const w = Validation.of(10)
      const value = 7

      expect(toValidationView(Validation.of(identity).ap(w))).toEqual(toValidationView(w))
      expect(toValidationView(Validation.of((x) => x + 1).ap(Validation.of(value)))).toEqual(
        toValidationView(Validation.of(((x) => x + 1)(value)))
      )
      expect(toValidationView(u.ap(Validation.of(value)))).toEqual(
        toValidationView(Validation.of((f) => f(value)).ap(u))
      )
      expect(
        toValidationView(
          Validation.of((f) => (g) => (x) => f(g(x)))
            .ap(u)
            .ap(v)
            .ap(w)
        )
      ).toEqual(toValidationView(u.ap(v.ap(w))))
    })
  })
})
