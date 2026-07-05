/** Module exporting the list concatenation monoid. */
/**
 * Array concatenation monoid.
 * @example
 * ListMonoid.concat([1], [2, 3])
 * ListMonoid.empty()
 */
export const ListMonoid = {
  empty: <T>(): T[] => [],
  concat: <T>(left: T[], right: T[]): T[] => left.concat(right)
}
