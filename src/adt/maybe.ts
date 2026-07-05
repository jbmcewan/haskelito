/** Module providing the Maybe algebraic data type and constructors. */
/** A maybe value that is either present (`Just`) or absent (`Nothing`). */
export type MaybeValue<T> = Just<T> | Nothing

/** Represents a present value in the Maybe ADT. */
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
  /** Creates a `Just` value. */
  Just: <T>(value: T) => MaybeValue<T>
  /** Creates a `Nothing` value. */
  Nothing: () => Nothing
  /** Converts nullable input to `Just` or `Nothing`. */
  fromNullable: <T>(value: T | null | undefined) => MaybeValue<NonNullable<T>>
  /** Alias for `Just`. */
  of: <T>(value: T) => MaybeValue<T>
}>

/** Maybe constructors and helpers. */
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

  fromNullable: <T>(value: T | null | undefined) =>
    (value ?? null) !== null ? Maybe.Just(value as NonNullable<T>) : Maybe.Nothing(),
  of: <T>(value: T) => Maybe.Just(value)
})
