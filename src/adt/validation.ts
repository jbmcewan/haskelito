/** Module providing the Validation ADT with error accumulation semantics. */
import { ListMonoid } from '../monoids/listMonoid.js'

/** A validation value that accumulates failures or carries success. */
export type ValidationValue<E, T> = Success<E, T> | Failure<E, T>

/** Represents a successful validation result. */
export type Success<E, T> = Readonly<{
  tag: 'Success'
  value: T
  map: <U>(fn: (value: T) => U) => ValidationValue<E, U>
  ap: <U>(other: ValidationValue<E, U>) => ValidationValue<E, unknown>
  fold: <U>(onFailure: (errors: E) => U, onSuccess: (value: T) => U) => U
}>

/** Represents a failed validation result with accumulated errors. */
export type Failure<E, T> = Readonly<{
  tag: 'Failure'
  value: E
  map: <U>(_fn: (value: T) => U) => ValidationValue<E, U>
  ap: <U>(other: ValidationValue<E, U>) => ValidationValue<E, unknown>
  fold: <U>(onFailure: (errors: E) => U, onSuccess: (value: T) => U) => U
}>

/** Constructors for creating Validation values. */
export type ValidationModule = Readonly<{
  /** Creates a successful validation result. */
  Success: <E, T>(value: T) => ValidationValue<E, T>
  /** Creates a failed validation result. */
  Failure: <E, T = never>(errors: E) => ValidationValue<E, T>
  /** Alias for `Success`. */
  of: <E, T>(value: T) => ValidationValue<E, T>
}>

/**
 * Validation constructors and applicative helpers.
 * @example
 * Validation.Success((value) => value * 2).ap(Validation.Success(4))
 * Validation.Failure(['email is required'])
 */
export const Validation: ValidationModule = Object.freeze({
  Success: <E, T>(value: T) =>
    Object.freeze({
      tag: 'Success' as const,
      value,
      map: <U>(fn: (value: T) => U) => Validation.Success<E, U>(fn(value)),
      ap: <U>(other: ValidationValue<E, U>) =>
        other.tag === 'Success'
          ? Validation.Success<E, unknown>((value as unknown as (arg: U) => unknown)(other.value))
          : other,
      fold: <U>(_: (errors: E) => U, onSuccess: (value: T) => U) => onSuccess(value)
    }),

  Failure: <E, T = never>(errors: E) =>
    Object.freeze({
      tag: 'Failure' as const,
      value: errors,
      map: <U>(_fn: (value: T) => U) => Validation.Failure<E, U>(errors),
      ap: <U>(other: ValidationValue<E, U>) =>
        other.tag === 'Failure'
          ? Validation.Failure<E, never>(
              ListMonoid.concat(errors as unknown[], other.value as unknown[]) as E
            )
          : Validation.Failure<E, never>(errors),
      fold: <U>(onFailure: (errors: E) => U, _onSuccess: (value: T) => U) => onFailure(errors)
    }),

  of: <E, T>(value: T) => Validation.Success<E, T>(value)
})
