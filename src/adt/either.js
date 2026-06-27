export const Either = Object.freeze({
  Right: (value) =>
    Object.freeze({
      tag: 'Right',
      value,
      map: (fn) => Either.Right(fn(value)),
      flatMap: (fn) => fn(value),
      fold: (_, onRight) => onRight(value)
    }),

  Left: (error) =>
    Object.freeze({
      tag: 'Left',
      value: error,
      map: () => Either.Left(error),
      flatMap: () => Either.Left(error),
      fold: (onLeft, _) => onLeft(error)
    }),

  tryCatch: (fn, onError) => {
    try {
      return Either.Right(fn())
    } catch (err) {
      return Either.Left(onError(err))
    }
  },

  fromNullable: (value, onNullable = () => 'Value was null or undefined') =>
    (value ?? null) !== null ? Either.Right(value) : Either.Left(onNullable(value)),
  of: (value) => Either.Right(value)
})
