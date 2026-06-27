export const Stream = {
  iterate: (fn, initial) =>
    function* () {
      const iterateFrom = function* (current) {
        yield current
        yield* iterateFrom(fn(current))
      }

      yield* iterateFrom(initial)
    }
}
