/** Module containing monoid-based folding helpers. */
import { curry } from '../combinators/curry.js'

/** Monoid contract used by fold helpers. */
type Monoid<T> = {
  empty: () => T
  concat: (left: T, right: T) => T
}

/** Minimal reducible contract used by `foldMap`. */
type Reducible<T> = {
  reduce: (fn: (acc: T, value: T) => T, initialValue: T) => T
}

/**
 * Maps values into a monoid context and folds with `concat`.
 * @example
 * foldMap(Sum, [1, 2, 3, 4])
 * foldMap(ListMonoid, [[1], [2], [3]])
 */
export const foldMap = curry((monoid: Monoid<unknown>, values: Reducible<unknown>): unknown => {
  if (!values || typeof values.reduce !== 'function') {
    throw new TypeError('foldMap expects a reducible values input')
  }

  return values.reduce(monoid.concat, monoid.empty())
})
