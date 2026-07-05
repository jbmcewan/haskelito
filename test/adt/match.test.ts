import { describe, expect, test } from 'vitest'

import { Either } from '../../src/adt/either.js'
import { match, matchOrElse } from '../../src/adt/match.js'

describe('match', () => {
  test('dispatches to the matching tag handler', () => {
    const handleResult = match({
      Right: (value: unknown) => `ok:${String(value)}`,
      Left: (error: unknown) => `error:${String(error)}`
    }) as (value: { tag?: string; value?: unknown }) => string

    expect(handleResult(Either.Right(1))).toBe('ok:1')
    expect(handleResult(Either.Left('boom'))).toBe('error:boom')
  })

  test('falls back to the wildcard handler', () => {
    const handleResult = match({
      _: () => 'fallback'
    }) as (value: { tag?: string; value?: unknown }) => string

    expect(handleResult({ tag: 'Unknown', value: 1 })).toBe('fallback')
  })

  test('throws when no pattern matches', () => {
    const handleResult = match({
      Right: (value: unknown) => value
    }) as (value: { tag?: string; value?: unknown }) => unknown

    expect(() => handleResult({ tag: 'Unknown', value: 1 })).toThrow(
      "Pattern matching failed: unhandled tag 'Unknown'"
    )
  })
})

describe('matchOrElse', () => {
  test('provides a total matching option', () => {
    const safeMatch = matchOrElse(
      {
        Right: (value: unknown) => `ok:${String(value)}`
      },
      () => 'fallback'
    ) as (value: { tag?: string; value?: unknown }) => string

    expect(safeMatch(Either.Right(3))).toBe('ok:3')
    expect(safeMatch(Either.Left('boom'))).toBe('fallback')
  })
})
