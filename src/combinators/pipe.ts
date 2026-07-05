/** Module containing left-to-right function piping helpers. */
/** Pipes a value through functions from left to right. */
export const pipe = (value: unknown, ...fns: Array<(value: unknown) => unknown>): unknown =>
  fns.reduce((acc, fn) => fn(acc), value)
