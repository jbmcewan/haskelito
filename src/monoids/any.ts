/** Module exporting the boolean disjunction monoid. */
/**
 * Boolean disjunction monoid.
 * @example
 * Any.concat(false, true)
 * Any.empty()
 */
export const Any = {
  empty: (): boolean => false,
  concat: (left: boolean, right: boolean): boolean => left || right
}
