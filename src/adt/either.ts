/** Module providing the Either algebraic data type and constructors. */
/** An either value that is `Left` (error) or `Right` (success). */
export type EitherValue<L, R> = Left<L, R> | Right<L, R>

/** Represents a successful branch in the Either ADT. */
export type Right<L, R> = Readonly<{
  tag: 'Right'
  value: R
  map: <U>(fn: (value: R) => U) => EitherValue<L, U>
  flatMap: <U>(fn: (value: R) => EitherValue<L, U>) => EitherValue<L, U>
  fold: <U>(onLeft: (error: L) => U, onRight: (value: R) => U) => U
}>

/** Represents an error branch in the Either ADT. */
export type Left<L, R> = Readonly<{
  tag: 'Left'
  value: L
  map: <U>(_fn: (value: R) => U) => EitherValue<L, U>
  flatMap: <U>(_fn: (value: R) => EitherValue<L, U>) => EitherValue<L, U>
  fold: <U>(onLeft: (error: L) => U, onRight: (value: R) => U) => U
}>

/** Constructors and helpers for creating Either values. */
export type EitherModule = Readonly<{
  /** Creates a successful `Right` value. */
  Right: <R>(value: R) => EitherValue<never, R>
  /** Creates an error `Left` value. */
  Left: <L>(error: L) => EitherValue<L, never>
  /** Maps over an error `Left` value while preserving `Right`. */
  mapLeft: <L, R, U>(
    fn: (error: L) => U,
    value: EitherValue<L, R> | EitherValue<never, R>
  ) => EitherValue<U, R>
  /** Maps both branches of an Either value. */
  bimap: <L, R, L2, R2>(
    onLeft: (error: L) => L2,
    onRight: (value: R) => R2,
    value: EitherValue<L, R> | EitherValue<never, R>
  ) => EitherValue<L2, R2>
  /** Wraps a throwing function and maps thrown errors into `Left`. */
  tryCatch: <R>(fn: () => R, onError: (error: unknown) => unknown) => EitherValue<unknown, R>
  /** Converts nullable input to `Right` or `Left`. */
  fromNullable: <R>(
    value: R | null | undefined,
    onNullable?: (value: R | null | undefined) => unknown
  ) => EitherValue<unknown, NonNullable<R>>
  /** Alias for `Right`. */
  of: <R>(value: R) => EitherValue<never, R>
}>

/**
 * Either constructors and helper functions.
 * @example
 * const parsed = Either.tryCatch(
 *   () => JSON.parse(input),
 *   (error) => error.message
 * )
 *
 * Either.mapLeft((error) => `ERR:${error}`, Either.Left('boom'))
 * Either.bimap((error) => `ERR:${error}`, (value) => value * 2, Either.Right(4))
 */
export const Either = Object.freeze({
  Right: <R>(value: R) =>
    Object.freeze({
      tag: 'Right' as const,
      value,
      map: <U>(fn: (value: R) => U) => Either.Right(fn(value)) as EitherValue<never, U>,
      flatMap: <U>(fn: (value: R) => EitherValue<never, U>) => fn(value),
      fold: <U>(_: (error: never) => U, onRight: (value: R) => U) => onRight(value)
    }),

  Left: <L>(error: L) =>
    Object.freeze({
      tag: 'Left' as const,
      value: error,
      map: <U>(_fn: (value: never) => U) => Either.Left(error) as EitherValue<L, U>,
      flatMap: <U>(_fn: (value: never) => EitherValue<L, U>) =>
        Either.Left(error) as EitherValue<L, U>,
      fold: <U>(onLeft: (error: L) => U, _onRight: (value: never) => U) => onLeft(error)
    }),

  mapLeft: <L, R, U>(fn: (error: L) => U, value: EitherValue<L, R> | EitherValue<never, R>) =>
    value.fold(
      (error) => Either.Left(fn(error)) as unknown as EitherValue<U, R>,
      (right) => Either.Right(right) as unknown as EitherValue<U, R>
    ),

  bimap: <L, R, L2, R2>(
    onLeft: (error: L) => L2,
    onRight: (value: R) => R2,
    value: EitherValue<L, R> | EitherValue<never, R>
  ) =>
    value.fold(
      (error) => Either.Left(onLeft(error)) as unknown as EitherValue<L2, R2>,
      (right) => Either.Right(onRight(right)) as unknown as EitherValue<L2, R2>
    ),

  tryCatch: <R>(fn: () => R, onError: (error: unknown) => unknown) => {
    try {
      return Either.Right(fn()) as unknown as EitherValue<unknown, R>
    } catch (err) {
      return Either.Left(onError(err)) as unknown as EitherValue<unknown, R>
    }
  },

  fromNullable: <R>(
    value: R | null | undefined,
    onNullable: (value: R | null | undefined) => unknown = () => 'Value was null or undefined'
  ) =>
    (value ?? null) !== null
      ? (Either.Right(value as NonNullable<R>) as unknown as EitherValue<unknown, NonNullable<R>>)
      : (Either.Left(onNullable(value)) as unknown as EitherValue<unknown, NonNullable<R>>),
  of: <R>(value: R) => Either.Right(value)
}) as EitherModule
