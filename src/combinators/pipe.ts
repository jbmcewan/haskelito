/** Module containing left-to-right function piping helpers. */
/**
 * Pipes a value through functions from left to right.
 *
 * @param value - The starting value.
 * @param fns - The transformation functions to apply in order.
 * @returns The final transformed value.
 * @example
 * pipe(2, (value) => value + 1, (value) => value * 3)
 */
export const pipe = (value: unknown, ...fns: Array<(value: unknown) => unknown>): unknown =>
  fns.reduce((acc, fn) => fn(acc), value)
