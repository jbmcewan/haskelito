# haskelito

Small functional programming utilities for JavaScript, organized around focused modules instead of a single monolithic entry file.

## Install

```bash
npm install haskelito
```

## Quick Start (Local Development)

```bash
npm install
npm test
npm run build
node examples/demo.js
```

## Root Import

```js
import {
  Maybe,
  Either,
  Validation,
  Reader,
  Effect,
  pipe,
  foldMap,
  Sum,
  Stream,
  take
} from 'haskelito'
```

## Subpath Imports

```js
import { Maybe } from 'haskelito/adt/maybe'
import { Either } from 'haskelito/adt/either'
import { Reader } from 'haskelito/monads/reader'
import { foldMap } from 'haskelito/monoids/foldMap'
import { take } from 'haskelito/collections/take'
```

Available subpath groups:

- `haskelito/adt/*`
- `haskelito/collections/*`
- `haskelito/combinators/*`
- `haskelito/monads/*`
- `haskelito/monoids/*`

## CommonJS Import

```js
const { Maybe, Either, pipe, foldMap, Sum, Stream, take } = require('haskelito')
```

## Module Layout

```text
src/
  adt/
    maybe.js
    either.js
    validation.js
    match.js
  collections/
    stream.js
    take.js
  combinators/
    curry.js
    pipe.js
    compose.js
    map.js
    chain.js
  monads/
    reader.js
    effect.js
  monoids/
    sum.js
    product.js
    all.js
    listMonoid.js
    foldMap.js
  index.js
```

## Exported API

- `combinators`: `curry`, `pipe`, `compose`, `map`, `chain`, `flatMap`
- `adt`: `Maybe`, `Either`, `Validation`, `match`, `matchOrElse`, `matchExhaustive`
- `monads`: `Reader`, `Effect`
- `monoids`: `Sum`, `Product`, `All`, `ListMonoid`, `foldMap`
- `collections`: `Stream`, `take`

## Common Helpers

The container-style modules expose a more consistent API:

- `Maybe.of(value)` is an alias for `Maybe.Just(value)`
- `Either.of(value)` is an alias for `Either.Right(value)`
- `Validation.of(value)` is an alias for `Validation.Success(value)`
- `Reader.of(value)` lifts a plain value into a `Reader`
- `Maybe.fromNullable(value)` converts nullable input into `Just` or `Nothing`
- `Either.fromNullable(value, onNullable)` converts nullable input into `Right` or `Left`
- `fold` is available on `Maybe`, `Either`, and `Validation` instances

## Examples

### Maybe

```js
const result = Maybe.fromNullable(user)
  .map((value) => value.name)
  .fold(
    () => 'Anonymous',
    (name) => name
  )
```

### Either

```js
const parsed = Either.tryCatch(
  () => JSON.parse(input),
  (error) => error.message
)

const message = parsed.fold(
  (error) => `Invalid input: ${error}`,
  (value) => `Loaded ${value.id}`
)
```

### Reader and Effect

```js
const readApiBase = Reader.ask().map((env) => env.apiBase)

const fetchConfig = Effect.of('/config.json').map((path) => `${path}?v=1`)
```

### Monoids and Lazy Streams

```js
const evens = Stream.iterate((n) => n + 2, 0)
const firstFive = take(5, evens)
const total = foldMap(Sum, firstFive)
```

## Development

```bash
npm test
npm run build
```

## Functional Standards

Project standards for functional JavaScript are documented in [FUNCTIONAL_STANDARDS.md](./FUNCTIONAL_STANDARDS.md). Treat the required rules in that document as merge criteria for new code.
