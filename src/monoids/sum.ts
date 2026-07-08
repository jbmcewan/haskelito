/** Module exporting the additive numeric monoid. */
/**
 * Numeric addition monoid.
 *
 * @example
 * Sum.concat(10, 20)
 * Sum.empty()
 */
export const Sum = {
  empty: (): number => 0,
  concat: (left: number, right: number): number => left + right
}
