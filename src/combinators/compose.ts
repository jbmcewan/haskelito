/** Module containing right-to-left composition helpers. */
/** Composes functions from right to left. */
export const compose =
  (...fns: Array<(value: unknown) => unknown>) =>
  (value: unknown): unknown =>
    fns.reduceRight((acc, fn) => fn(acc), value)
