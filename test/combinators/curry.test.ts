import { describe, expect, test } from 'vitest'

import { curry } from '../../src/combinators/curry.js'

describe('curry', () => {
  test('supports partial application', () => {
    const add3 = curry((a: number, b: number, c: number) => a + b + c) as unknown as any

    expect(add3(1)(2)(3)).toBe(6)
    expect(add3(1, 2)(3)).toBe(6)
    expect(add3(1)(2, 3)).toBe(6)
  })

  test('invokes the original function once enough arguments are provided', () => {
    const join = curry((left: string, right: string) => `${left}:${right}`) as unknown as (
      left: string,
      right: string
    ) => string

    expect(join('a', 'b')).toBe('a:b')
  })

  test('validates boundary input', () => {
    expect(() => curry(123 as unknown as (...args: unknown[]) => unknown)).toThrow(
      'curry expects a function'
    )
  })
})
