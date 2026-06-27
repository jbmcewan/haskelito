import { curry } from './curry.js'

export const chain = curry((fn, monad) => monad.flatMap(fn))
export const flatMap = chain
