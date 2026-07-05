/** Module exporting the multiplicative numeric monoid. */
/** Numeric multiplication monoid. */
export const Product = {
  empty: (): number => 1,
  concat: (left: number, right: number): number => left * right
}
