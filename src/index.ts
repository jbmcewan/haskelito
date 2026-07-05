/**
 * Barrel module for public haskelito FP primitives and utilities.
 * Re-exports stable APIs from all domain modules.
 */
export { curry } from './combinators/curry.js'
export { pipe } from './combinators/pipe.js'
export { compose } from './combinators/compose.js'
export { map } from './combinators/map.js'
export { chain, flatMap } from './combinators/chain.js'

export { Maybe } from './adt/maybe.js'
export { Either } from './adt/either.js'
export { Validation } from './adt/validation.js'
export { match, matchOrElse, matchExhaustive } from './adt/match.js'

export { Reader } from './monads/reader.js'
export { Effect } from './monads/effect.js'

export { Sum } from './monoids/sum.js'
export { Product } from './monoids/product.js'
export { All } from './monoids/all.js'
export { Any } from './monoids/any.js'
export { First } from './monoids/first.js'
export { Last } from './monoids/last.js'
export { ListMonoid } from './monoids/listMonoid.js'
export { foldMap } from './monoids/foldMap.js'

export { Stream } from './collections/stream.js'
export { take } from './collections/take.js'
