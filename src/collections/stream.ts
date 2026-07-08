/** Module for lazy stream constructors and helpers. */
/**
 * Lazy stream utilities.
 *
 * @example
 * const evens = Stream.iterate((value) => value + 2, 0)
 */
export const Stream = {
  /**
   * Creates an infinite generator by repeatedly applying `fn`.
   *
   * @param fn - Produces the next value from the current one.
   * @param initial - The first value yielded by the stream.
   * @returns A generator factory for the lazy stream.
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
