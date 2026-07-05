/** Module containing function currying helpers. */
/**
 * Curries a function by collecting arguments until arity is satisfied.
 * @example
 * const add3 = curry((a, b, c) => a + b + c)
 *
 * add3(1)(2)(3)
 */
export const curry = <TArgs extends unknown[], TResult>(fn: (...args: TArgs) => TResult) => {
  if (typeof fn !== 'function') {
    throw new TypeError('curry expects a function')
  }

  const curried = (...args: unknown[]): unknown => {
    if (args.length >= fn.length) {
      return fn(...(args as TArgs))
    }

    return (...nextArgs: unknown[]) => curried(...args, ...nextArgs)
  }

  return curried as (...args: unknown[]) => unknown
}
