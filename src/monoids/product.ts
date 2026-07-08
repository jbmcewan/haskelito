/** Module exporting the multiplicative numeric monoid. */
/**
 * Numeric multiplication monoid.
 *
 * @example
 * Product.concat(4, 5)
 * Product.empty()
 */
export const Product = {
  empty: (): number => 1,
  concat: (left: number, right: number): number => left * right
}
