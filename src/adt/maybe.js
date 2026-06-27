export const Maybe = Object.freeze({
  Just: (value) =>
    Object.freeze({
      tag: 'Just',
      value,
      map: (fn) => Maybe.Just(fn(value)),
      flatMap: (fn) => fn(value),
      fold: (_, onJust) => onJust(value),
      getOrElse: () => value
    }),

  Nothing: () =>
    Object.freeze({
      tag: 'Nothing',
      map: () => Maybe.Nothing(),
      flatMap: () => Maybe.Nothing(),
      fold: (onNothing, _) => onNothing(),
      getOrElse: (defaultValue) => defaultValue
    }),

  fromNullable: (value) => ((value ?? null) !== null ? Maybe.Just(value) : Maybe.Nothing()),
  of: (value) => Maybe.Just(value)
})
