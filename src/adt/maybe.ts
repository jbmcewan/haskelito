/** Module providing the Maybe algebraic data type and constructors. */
import { Either, type EitherValue } from './either.js'

/**
 * A maybe value that is either present (`Just`) or absent (`Nothing`).
 *
 * @typeParam T - The wrapped success value.
 */
export type MaybeValue<T> = Just<T> | Nothing

/**
 * Represents a present value in the Maybe ADT.
 *
 * @typeParam T - The wrapped value type.
 */
export type Just<T> = Readonly<{
  tag: 'Just'
  value: T
  map: <U>(fn: (value: T) => U) => MaybeValue<U>
  flatMap: <U>(fn: (value: T) => MaybeValue<U>) => MaybeValue<U>
  fold: <U>(onNothing: () => U, onJust: (value: T) => U) => U
  getOrElse: (_defaultValue: T) => T
}>

/** Represents an absent value in the Maybe ADT. */
export type Nothing = Readonly<{
  tag: 'Nothing'
  map: <U>(_fn: (value: never) => U) => MaybeValue<U>
  flatMap: <U>(_fn: (value: never) => MaybeValue<U>) => MaybeValue<U>
  fold: <U>(onNothing: () => U, onJust: (value: never) => U) => U
  getOrElse: <U>(defaultValue: U) => U
}>

/** Constructors and helpers for creating Maybe values. */
export type MaybeModule = Readonly<{
  /**
   * Creates a `Just` value.
   *
   * @param value - The value to wrap.
   * @returns A present maybe value.
   */
  Just: <T>(value: T) => MaybeValue<T>
  /**
   * Creates a `Nothing` value.
   *
   * @returns An absent maybe value.
   */
  Nothing: () => Nothing
  /**
   * Converts a Maybe value into an Either value.
   *
   * @param onNothing - Produces the left value when the maybe is absent.
   * @param value - The maybe value to convert.
   * @returns A right value for `Just`, or a left value for `Nothing`.
   */
  toEither: <L, T>(onNothing: () => L, value: MaybeValue<T>) => EitherValue<L, T>
  /**
   * Keeps a `Just` only when the predicate returns true.
   *
   * @param predicate - Checks whether the wrapped value should be kept.
   * @param value - The maybe value to test.
   * @returns The original `Just` when the predicate passes, otherwise `Nothing`.
   */
  filter: <T>(predicate: (value: T) => boolean, value: MaybeValue<T>) => MaybeValue<T>
  /**
   * Returns the original Maybe when present, otherwise uses a fallback.
   *
   * @param fallback - Produces the replacement maybe value when absent.
   * @param value - The maybe value to inspect.
   * @returns The original value when present, otherwise the fallback result.
   */
  orElse: <T>(fallback: () => MaybeValue<T>, value: MaybeValue<T>) => MaybeValue<T>
  /**
   * Converts nullable input to `Just` or `Nothing`.
   *
   * @param value - The nullable input value.
   * @returns `Just` when the value is non-nullish, otherwise `Nothing`.
   */
  fromNullable: <T>(value: T | null | undefined) => MaybeValue<NonNullable<T>>
  /**
   * Alias for `Just`.
   *
   * @param value - The value to wrap.
   * @returns A present maybe value.
   */
  of: <T>(value: T) => MaybeValue<T>
}>

/**
 * Maybe constructors and helpers.
 *
 * @example
 * const result = Maybe.fromNullable(user)
 *   .map((value) => value.name)
 *   .fold(
 *     () => 'Anonymous',
 *     (name) => name
 *   )
 *
 * Maybe.toEither(() => 'missing user', Maybe.fromNullable(user))
 * Maybe.filter((value) => value.active, Maybe.Just(user))
 * Maybe.orElse(() => Maybe.Just(fallbackUser), Maybe.Nothing())
 */
export const Maybe: MaybeModule = Object.freeze({
  Just: <T>(value: T) =>
    Object.freeze({
      tag: 'Just' as const,
      value,
      map: <U>(fn: (value: T) => U) => Maybe.Just(fn(value)),
      flatMap: <U>(fn: (value: T) => MaybeValue<U>) => fn(value),
      fold: <U>(_: () => U, onJust: (value: T) => U) => onJust(value),
      getOrElse: (_defaultValue: T) => value
    }),

  Nothing: () =>
    Object.freeze({
      tag: 'Nothing' as const,
      map: <U>(_fn: (value: never) => U) => Maybe.Nothing() as MaybeValue<U>,
      flatMap: <U>(_fn: (value: never) => MaybeValue<U>) => Maybe.Nothing() as MaybeValue<U>,
      fold: <U>(onNothing: () => U, _onJust: (value: never) => U) => onNothing(),
      getOrElse: <U>(defaultValue: U) => defaultValue
    }),

  toEither: <L, T>(onNothing: () => L, value: MaybeValue<T>) =>
    value.fold(
      () => Either.Left(onNothing()) as unknown as EitherValue<L, T>,
      (inner) => Either.Right(inner) as unknown as EitherValue<L, T>
    ),

  filter: <T>(predicate: (value: T) => boolean, value: MaybeValue<T>) =>
    value.fold(
      () => Maybe.Nothing(),
      (inner) => (predicate(inner) ? Maybe.Just(inner) : Maybe.Nothing())
    ),

  orElse: <T>(fallback: () => MaybeValue<T>, value: MaybeValue<T>) =>
    value.fold(
      () => fallback(),
      () => value
    ),

  fromNullable: <T>(value: T | null | undefined) =>
    (value ?? null) !== null ? Maybe.Just(value as NonNullable<T>) : Maybe.Nothing(),
  of: <T>(value: T) => Maybe.Just(value)
})
