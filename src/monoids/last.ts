/** Module exporting the last-present Maybe monoid. */
import { Maybe, type MaybeValue } from '../adt/maybe.js'

/**
 * Monoid that keeps the last `Just` value.
 *
 * @example
 * Last.of('secondary')
 * Last.fromNullable(user)
 * Last.concat(Last.of('primary'), Last.of('secondary'))
 */
export const Last = {
  of: <T>(value: T): MaybeValue<T> => Maybe.Just(value),
  fromNullable: <T>(value: T | null | undefined): MaybeValue<NonNullable<T>> =>
    Maybe.fromNullable(value),
  empty: <T>(): MaybeValue<T> => Maybe.Nothing(),
  concat: <T>(left: MaybeValue<T>, right: MaybeValue<T>): MaybeValue<T> =>
    right.tag === 'Just' ? right : left
}
