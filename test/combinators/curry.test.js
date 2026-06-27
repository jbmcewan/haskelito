import { describe, expect, test } from 'vitest'

import { curry } from '../../src/combinators/curry.js'

describe('curry', () => {
  test('supports partial application', () => {
    const add3 = curry((a, b, c) => a + b + c)

    expect(add3(1)(2)(3)).toBe(6)
    expect(add3(1, 2)(3)).toBe(6)
    expect(add3(1)(2, 3)).toBe(6)
  })

  test('invokes the original function once enough arguments are provided', () => {
    const join = curry((left, right) => `${left}:${right}`)

    expect(join('a', 'b')).toBe('a:b')
  })

  test('validates boundary input', () => {
    expect(() => curry(123)).toThrow('curry expects a function')
  })
})
