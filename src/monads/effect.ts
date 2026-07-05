/** Module providing the Effect monad for deferred async side effects. */
/** Effect instance contract. */
type EffectValue<T> = Readonly<{
  tag: 'Effect'
  run: () => Promise<T>
  map: <U>(fn: (value: T) => U) => EffectValue<U>
  flatMap: <U>(fn: (value: T) => EffectValue<U>) => EffectValue<U>
}>

/** Internal constructor for validated Effect values. */
const createEffect = <T>(run: () => Promise<T>): EffectValue<T> => {
  if (typeof run !== 'function') {
    throw new TypeError('Effect expects run to be a function')
  }

  const self: EffectValue<T> = Object.freeze({
    tag: 'Effect',
    run,
    map: <U>(fn: (value: T) => U) => self.flatMap((currentValue) => Effect.of(fn(currentValue))),
    flatMap: <U>(fn: (value: T) => EffectValue<U>) =>
      createEffect(() =>
        self.run().then((currentValue) => {
          const next = fn(currentValue)

          if (!next || typeof next.run !== 'function') {
            throw new TypeError('Effect.flatMap expects fn to return an Effect-like value')
          }

          return next.run()
        })
      )
  })

  return self
}

/** Effect monad for controlled async side effects. */
export const Effect = Object.freeze({
  /** Lifts a plain value into an effect that resolves immediately. */
  of: <T>(value: T): EffectValue<T> => createEffect(() => Promise.resolve(value)),

  /** Captures thrown/rejected failures and maps them with `onError`. */
  tryCatch: <T>(
    thunk: () => T | Promise<T>,
    onError: (error: unknown) => T | Promise<T>
  ): EffectValue<T> => {
    if (typeof thunk !== 'function') {
      throw new TypeError('Effect.tryCatch expects thunk to be a function')
    }

    if (typeof onError !== 'function') {
      throw new TypeError('Effect.tryCatch expects onError to be a function')
    }

    return createEffect(() => Promise.resolve().then(thunk).catch(onError))
  }
})
