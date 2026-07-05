/** Module containing tagged-union pattern matching helpers. */
import { curry } from '../combinators/curry.js'

/** A tagged value accepted by the match helpers. */
type TaggedValue =
  | {
      tag?: string
      value?: unknown
    }
  | null
  | undefined

/** Pattern map keyed by tags, with optional wildcard `_`. */
type MatchPatterns<T = unknown> = Record<string, (value: unknown) => T> & {
  _?: () => T
}

/**
 * Pattern matches on a tagged value.
 * Uses `_` as a fallback handler when provided.
 * @example
 * const render = match({
 *   Left: (error) => `error:${error}`,
 *   Right: (value) => `ok:${value}`
 * })
 *
 * render(Either.Right(3))
 */
export const match = curry((patterns: MatchPatterns, value: TaggedValue) => {
  const tag = value?.tag

  if (tag && tag in patterns) return patterns[tag](value?.value)
  if ('_' in patterns && patterns._) return patterns._()

  throw new Error(`Pattern matching failed: unhandled tag '${tag}'`)
})

/**
 * Pattern matches on a tagged value with an explicit fallback function.
 * @example
 * matchOrElse({ Just: (value) => `just:${value}` }, () => 'fallback')(Maybe.Nothing())
 */
export const matchOrElse = curry(
  (patterns: MatchPatterns, fallback: (value: TaggedValue) => unknown, value: TaggedValue) => {
    const tag = value?.tag

    if (tag && tag in patterns) return patterns[tag](value?.value)
    return fallback(value)
  }
)

/**
 * Pattern matches on a tagged value and throws if no branch is found.
 * @example
 * matchExhaustive({
 *   Left: (error) => `left:${error}`,
 *   Right: (value) => `right:${value}`
 * })(Either.Right('done'))
 */
export const matchExhaustive = curry((patterns: MatchPatterns, value: TaggedValue) => {
  const tag = value?.tag

  if (tag && tag in patterns) return patterns[tag](value?.value)

  throw new Error(`Pattern matching failed: unhandled tag '${tag}'`)
})
