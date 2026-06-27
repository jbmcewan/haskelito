import { curry } from '../combinators/curry.js'

export const take = curry((count, generatorFactory) => {
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

  const collect = (remaining, accumulated) => {
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
