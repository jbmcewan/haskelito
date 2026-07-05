/** Module exporting the additive numeric monoid. */
/** Numeric addition monoid. */
export const Sum = {
  empty: (): number => 0,
  concat: (left: number, right: number): number => left + right
}
