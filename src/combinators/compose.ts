/** Module containing right-to-left composition helpers. */
/**
 * Composes functions from right to left.
 * @example
 * const format = compose(
 *   (value) => value.toUpperCase(),
 *   (value) => `${value}!`
 * )
 *
 * format('hi')
 */
export const compose =
  (...fns: Array<(value: unknown) => unknown>) =>
  (value: unknown): unknown =>
    fns.reduceRight((acc, fn) => fn(acc), value)
