/** Module containing functor mapping helpers. */
import { curry } from './curry.js'

/** Contract for values that support `map`. */
type Mappable = {
  map: (fn: (value: unknown) => unknown) => unknown
}

/** Lifts a function over a functor-like value exposing `map`. */
export const map = curry((fn: (value: unknown) => unknown, functor: Mappable): unknown =>
  functor.map(fn)
)
