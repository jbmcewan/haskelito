/** Module exporting the list concatenation monoid. */
/** Array concatenation monoid. */
export const ListMonoid = {
  empty: <T>(): T[] => [],
  concat: <T>(left: T[], right: T[]): T[] => left.concat(right)
}
