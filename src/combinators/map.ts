/** Module containing functor mapping helpers. */
import { curry } from './curry.js'

/** Contract for values that support `map`. */
type Mappable = {
  map: (fn: (value: unknown) => unknown) => unknown
}

/**
 * Lifts a function over a functor-like value exposing `map`.
 * @example
 * map((value) => value * 2, Maybe.Just(4))
 */
export const map = curry((fn: (value: unknown) => unknown, functor: Mappable): unknown =>
  functor.map(fn)
)
