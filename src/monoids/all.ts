/** Module exporting the boolean conjunction monoid. */
/** Boolean conjunction monoid. */
export const All = {
  empty: (): boolean => true,
  concat: (left: boolean, right: boolean): boolean => left && right
}
