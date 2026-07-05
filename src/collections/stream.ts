/** Module for lazy stream constructors and helpers. */
/** Lazy stream utilities. */
export const Stream = {
  /**
   * Creates an infinite generator by repeatedly applying `fn`.
   */
  iterate: <T>(fn: (value: T) => T, initial: T) =>
    function* (): Generator<T, void, unknown> {
      const iterateFrom = function* (current: T): Generator<T, void, unknown> {
        yield current
        yield* iterateFrom(fn(current))
      }

      yield* iterateFrom(initial)
    }
}
