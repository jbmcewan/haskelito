/** Module containing utilities for bounded collection from iterators. */
import { curry } from '../combinators/curry.js'

/**
 * Minimal iterator contract used by `take`.
 *
 * @typeParam T - The yielded value type.
 */
type IteratorLike<T> = {
  next: () => IteratorResult<T>
}

/**
 * Takes `count` elements from a generator factory.
 * @example
 * take(5, Stream.iterate((value) => value + 2, 0))
 */
export const take = curry((count: number, generatorFactory: () => IteratorLike<unknown>) => {
  if (!Number.isInteger(count) || count < 0) {
    throw new TypeError('take expects count to be a non-negative integer')
  }

  if (typeof generatorFactory !== 'function') {
    throw new TypeError('take expects a generator factory function')
  }

  const iterator = generatorFactory()

  if (!iterator || typeof iterator.next !== 'function') {
    throw new TypeError('take expects generatorFactory to return an iterator')
  }

  const collect = (remaining: number, accumulated: unknown[]): unknown[] => {
    if (remaining === 0) {
      return accumulated
    }

    const { value, done } = iterator.next()

    if (done) {
      return accumulated
    }

    return collect(remaining - 1, [...accumulated, value])
  }

  return collect(count, [])
})
