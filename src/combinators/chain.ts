/** Module containing monadic chaining helpers. */
import { curry } from './curry.js'

/** Contract for values that support `flatMap`. */
type Chainable = {
  flatMap: (fn: (value: unknown) => unknown) => unknown
}

/**
 * Sequences monadic computations over values exposing `flatMap`.
 * @example
 * chain((value) => Maybe.Just(value + 5), Maybe.Just(2))
 */
export const chain = curry((fn: (value: unknown) => unknown, monad: Chainable): unknown =>
  monad.flatMap(fn)
)
/**
 * Alias for `chain`.
 * @example
 * flatMap((value) => Maybe.Just(value * 3), Maybe.Just(2))
 */
export const flatMap = chain
