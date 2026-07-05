/** Module containing monadic chaining helpers. */
import { curry } from './curry.js'

/** Contract for values that support `flatMap`. */
type Chainable = {
  flatMap: (fn: (value: unknown) => unknown) => unknown
}

/** Sequences monadic computations over values exposing `flatMap`. */
export const chain = curry((fn: (value: unknown) => unknown, monad: Chainable): unknown =>
  monad.flatMap(fn)
)
/** Alias for `chain`. */
export const flatMap = chain
