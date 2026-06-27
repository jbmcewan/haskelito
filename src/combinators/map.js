import { curry } from './curry.js'

export const map = curry((fn, functor) => functor.map(fn))
