# Usage Examples

This page shows one minimal example for every export in the root API.

## Using In Another Project

Install the package in your own app:

```bash
npm install haskelito
```

Then import from the published package name, not from this repository's local `dist` or `src` files:

```js
import { Maybe, Either, pipe, foldMap, Sum } from 'haskelito'

const displayName = (user) =>
  Maybe.fromNullable(user)
    .map((value) => value.name)
    .getOrElse('Anonymous')

const parseJson = (input) =>
  Either.tryCatch(
    () => JSON.parse(input),
    (error) => (error instanceof Error ? error.message : String(error))
  )

const total = foldMap(Sum, [1, 2, 3, 4])

console.log(displayName({ name: 'Ada' }))
console.log(
  parseJson('{"ok":true}').fold(
    (err) => `error:${err}`,
    (value) => value
  )
)
console.log(
  pipe(
    2,
    (x) => x + 1,
    (x) => x * 3
  )
)
console.log(total)
```

For smaller imports, you can also use supported subpaths:

```js
import { Maybe } from 'haskelito/adt/maybe'
import { Reader } from 'haskelito/monads/reader'
import { foldMap } from 'haskelito/monoids/foldMap'
```

Use the published package exports, and avoid local repository paths like `../dist/index.js`, which are only used by examples that run inside this repo.

## Combinators

### `curry`

```js
const add3 = curry((a, b, c) => a + b + c)

add3(1)(2)(3)
```

### `pipe`

```js
pipe(
  2,
  (value) => value + 1,
  (value) => value * 3
)
```

### `compose`

```js
const format = compose(
  (value) => value.toUpperCase(),
  (value) => `${value}!`
)

format('hi')
```

### `map`

```js
map((value) => value * 2, Maybe.Just(4))
```

### `chain`

```js
chain((value) => Maybe.Just(value + 5), Maybe.Just(2))
```

### `flatMap`

```js
flatMap((value) => Maybe.Just(value * 3), Maybe.Just(2))
```

## ADTs

### `Maybe`

```js
const maybeName = Maybe.fromNullable(user)
  .map((value) => value.name)
  .fold(
    () => 'Anonymous',
    (name) => name
  )
```

Extra helpers:

```js
Maybe.toEither(() => 'user missing', Maybe.fromNullable(user))
Maybe.filter((value) => value.active, Maybe.Just(user))
Maybe.orElse(() => Maybe.Just(fallbackUser), Maybe.Nothing())
```

### `Either`

```js
const parsed = Either.tryCatch(
  () => JSON.parse(input),
  (error) => error.message
)

parsed.fold(
  (error) => `Invalid: ${error}`,
  (value) => `Loaded ${value.id}`
)
```

Extra helpers:

```js
Either.mapLeft((error) => `ERR:${error}`, Either.Left('boom'))
Either.bimap(
  (error) => `ERR:${error}`,
  (value) => value * 2,
  Either.Right(4)
)
```

### `Validation`

```js
Validation.Success((value) => value * 2).ap(Validation.Success(4))
Validation.Failure(['email is required'])
```

### `match`

```js
const render = match({
  Left: (error) => `error:${error}`,
  Right: (value) => `ok:${value}`
})

render(Either.Right(3))
```

### `matchOrElse`

```js
matchOrElse({ Just: (value) => `just:${value}` }, () => 'fallback')(Maybe.Nothing())
```

### `matchExhaustive`

```js
matchExhaustive({
  Left: (error) => `left:${error}`,
  Right: (value) => `right:${value}`
})(Either.Right('done'))
```

## Monads

### `Reader`

```js
const readBaseUrl = Reader.asks((env) => env.baseUrl)

readBaseUrl.run({ baseUrl: 'https://example.test' })
```

```js
const versioned = Reader.local(
  (env) => ({ baseUrl: `${env.baseUrl}/v1` }),
  Reader((env) => env.baseUrl)
)
```

### `Effect`

```js
const pathEffect = Effect.of('config.json').map((path) => `/static/${path}`)

await pathEffect.run()
```

```js
await Effect.tryCatch(
  () => fetch('/api/data').then((response) => response.json()),
  (error) => ({ error: error.message })
).run()
```

## Monoids

### `Sum`

```js
Sum.concat(10, 20)
Sum.empty()
```

### `Product`

```js
Product.concat(4, 5)
Product.empty()
```

### `All`

```js
All.concat(true, false)
All.empty()
```

### `Any`

```js
Any.concat(false, true)
Any.empty()
```

### `First`

```js
First.of('primary')
First.fromNullable(user)
First.concat(Maybe.Just('primary'), Maybe.Just('secondary'))
```

### `Last`

```js
Last.of('secondary')
Last.fromNullable(user)
Last.concat(Maybe.Just('primary'), Maybe.Just('secondary'))
```

### `ListMonoid`

```js
ListMonoid.concat([1], [2, 3])
ListMonoid.empty()
```

### `foldMap`

```js
foldMap(Sum, [1, 2, 3, 4])
foldMap(ListMonoid, [[1], [2], [3]])
```

## Collections

### `Stream`

```js
const evens = Stream.iterate((value) => value + 2, 0)
```

### `take`

```js
take(
  5,
  Stream.iterate((value) => value + 2, 0)
)
```

## Runnable Overview

For a runnable overview that exercises the entire root API, see [examples/api-overview.js](../examples/api-overview.js).
