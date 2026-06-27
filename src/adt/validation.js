import { ListMonoid } from '../monoids/listMonoid.js'

export const Validation = Object.freeze({
  Success: (value) =>
    Object.freeze({
      tag: 'Success',
      value,
      map: (fn) => Validation.Success(fn(value)),
      ap: (other) => (other.tag === 'Success' ? Validation.Success(value(other.value)) : other),
      fold: (_, onSuccess) => onSuccess(value)
    }),

  Failure: (errors) =>
    Object.freeze({
      tag: 'Failure',
      value: errors,
      map: () => Validation.Failure(errors),
      ap: (other) =>
        other.tag === 'Failure'
          ? Validation.Failure(ListMonoid.concat(errors, other.value))
          : Validation.Failure(errors),
      fold: (onFailure, _) => onFailure(errors)
    }),

  of: (value) => Validation.Success(value)
})
