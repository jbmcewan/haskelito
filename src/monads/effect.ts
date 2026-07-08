/** Module providing the Effect monad for deferred async side effects. */
/**
 * Effect instance contract.
 *
 * @typeParam T - The resolved value type.
 */
type EffectValue<T> = Readonly<{
  tag: 'Effect'
  run: () => Promise<T>
  map: <U>(fn: (value: T) => U) => EffectValue<U>
  flatMap: <U>(fn: (value: T) => EffectValue<U>) => EffectValue<U>
}>

/**
 * Internal constructor for validated Effect values.
 *
 * @typeParam T - The resolved value type.
 * @param run - The deferred async computation.
 * @returns A validated effect instance.
 */
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

/**
 * Effect monad for controlled async side effects.
 *
 * @example
 * const pathEffect = Effect.of('config.json').map((path) => `/static/${path}`)
 *
 * await pathEffect.run()
 *
 * await Effect.tryCatch(
 *   () => fetch('/api/data').then((response) => response.json()),
 *   (error) => ({ error: error.message })
 * ).run()
 */
export const Effect = Object.freeze({
  /**
   * Lifts a plain value into an effect that resolves immediately.
   *
   * @param value - The value to lift.
   * @returns An effect that resolves with the provided value.
   */
  of: <T>(value: T): EffectValue<T> => createEffect(() => Promise.resolve(value)),

  /**
   * Captures thrown or rejected failures and maps them with `onError`.
   *
   * @param thunk - Produces the effectful value.
   * @param onError - Produces a recovery value when the thunk fails.
   * @returns An effect that resolves either the success or recovery path.
   */
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
  },

  /**
   * Runs a finalizer after an effect settles, regardless of success or failure.
   *
   * @param effect - The effect to execute.
   * @param finalizer - Cleanup logic guaranteed to run after `effect` settles.
   * @returns An effect that preserves the original success/failure semantics.
   */
  ensuring: <T>(
    effect: EffectValue<T>,
    finalizer: () => unknown | Promise<unknown>
  ): EffectValue<T> => {
    if (!effect || typeof effect.run !== 'function') {
      throw new TypeError('Effect.ensuring expects effect to be an Effect-like value')
    }

    if (typeof finalizer !== 'function') {
      throw new TypeError('Effect.ensuring expects finalizer to be a function')
    }

    return createEffect(async () => {
      try {
        return await effect.run()
      } finally {
        await finalizer()
      }
    })
  },

  /**
   * Safely acquires, uses, and releases a resource.
   *
   * @param acquire - Creates the resource.
   * @param use - Uses the resource and produces a result.
   * @param release - Cleans up the resource.
   * @returns An effect that guarantees release after use settles.
   */
  bracket: <A, B>(
    acquire: () => A | Promise<A>,
    use: (resource: A) => B | Promise<B>,
    release: (resource: A) => unknown | Promise<unknown>
  ): EffectValue<B> => {
    if (typeof acquire !== 'function') {
      throw new TypeError('Effect.bracket expects acquire to be a function')
    }

    if (typeof use !== 'function') {
      throw new TypeError('Effect.bracket expects use to be a function')
    }

    if (typeof release !== 'function') {
      throw new TypeError('Effect.bracket expects release to be a function')
    }

    return createEffect(async () => {
      const resource = await acquire()

      try {
        return await use(resource)
      } finally {
        await release(resource)
      }
    })
  }
})
