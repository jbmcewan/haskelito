/** Module providing the Reader monad for environment-dependent computations. */
/** Reader instance contract. */
type ReaderValue<TEnv, TValue> = Readonly<{
  tag: 'Reader'
  run: (env: TEnv) => TValue
  map: <U>(fn: (value: TValue) => U) => ReaderValue<TEnv, U>
  flatMap: <U>(fn: (value: TValue) => ReaderValue<TEnv, U>) => ReaderValue<TEnv, U>
}>

/** Reader module factory and static helpers. */
type ReaderModule = ((run: (env: unknown) => unknown) => ReaderValue<unknown, unknown>) & {
  /** Lifts a value into Reader context. */
  of: <T>(value: T) => ReaderValue<unknown, T>
  /** Returns the full environment as the value. */
  ask: <TEnv>() => ReaderValue<TEnv, TEnv>
}

/** Reader monad for dependency injection via an environment value. */
export const Reader: ReaderModule = Object.freeze(
  Object.assign(
    (run: (env: unknown) => unknown) =>
      Object.freeze({
        tag: 'Reader' as const,
        run,
        map: <U>(fn: (value: unknown) => U) => Reader((env: unknown) => fn(run(env))),
        flatMap: <U>(fn: (value: unknown) => ReaderValue<unknown, U>) =>
          Reader((env: unknown) => fn(run(env)).run(env))
      }),
    {
      of: <T>(value: T) => Reader(() => value) as ReaderValue<unknown, T>,
      ask: <TEnv>() => Reader((env: unknown) => env as TEnv) as ReaderValue<TEnv, TEnv>
    }
  )
) as ReaderModule
