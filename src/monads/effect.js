const createEffect = (run) => {
  if (typeof run !== 'function') {
    throw new TypeError('Effect expects run to be a function')
  }

  const self = Object.freeze({
    tag: 'Effect',
    run,
    map: (fn) => self.flatMap((currentValue) => Effect.of(fn(currentValue))),
    flatMap: (fn) =>
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

export const Effect = Object.freeze({
  of: (value) => createEffect(() => Promise.resolve(value)),

  tryCatch: (thunk, onError) => {
    if (typeof thunk !== 'function') {
      throw new TypeError('Effect.tryCatch expects thunk to be a function')
    }

    if (typeof onError !== 'function') {
      throw new TypeError('Effect.tryCatch expects onError to be a function')
    }

    return createEffect(() => Promise.resolve().then(thunk).catch(onError))
  }
})
