/** Module exporting the boolean conjunction monoid. */
/**
 * Boolean conjunction monoid.
 * @example
 * All.concat(true, false)
 * All.empty()
 */
export const All = {
  empty: (): boolean => true,
  concat: (left: boolean, right: boolean): boolean => left && right
}
