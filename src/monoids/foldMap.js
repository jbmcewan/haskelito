import { curry } from '../combinators/curry.js'

export const foldMap = curry((monoid, values) => {
  if (!values || typeof values.reduce !== 'function') {
    throw new TypeError('foldMap expects a reducible values input')
  }

  return values.reduce(monoid.concat, monoid.empty())
})
