export const Reader = Object.freeze(
  Object.assign(
    (run) =>
      Object.freeze({
        tag: 'Reader',
        run,
        map: (fn) => Reader((env) => fn(run(env))),
        flatMap: (fn) => Reader((env) => fn(run(env)).run(env))
      }),
    {
      of: (value) => Reader(() => value),
      ask: () => Reader((env) => env)
    }
  )
)
