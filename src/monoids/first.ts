/** Module exporting the first-present Maybe monoid. */
import { Maybe, type MaybeValue } from '../adt/maybe.js'

/**
 * Monoid that keeps the first `Just` value.
 * @example
 * First.of('primary')
 * First.fromNullable(user)
 * First.concat(First.of('primary'), First.of('secondary'))
 */
export const First = {
  of: <T>(value: T): MaybeValue<T> => Maybe.Just(value),
  fromNullable: <T>(value: T | null | undefined): MaybeValue<NonNullable<T>> =>
    Maybe.fromNullable(value),
  empty: <T>(): MaybeValue<T> => Maybe.Nothing(),
  concat: <T>(left: MaybeValue<T>, right: MaybeValue<T>): MaybeValue<T> =>
    left.tag === 'Just' ? left : right
}
