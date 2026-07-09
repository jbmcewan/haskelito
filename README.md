# haskelito

Small functional programming utilities for TypeScript, organized around focused modules instead of a single monolithic entry file.

## Install

```bash
npm install haskelito
```

## Quick Start (Local Development)

```bash
npm install
npm run setup:git-hooks
npm test
npm run build
node examples/demo.js
```

## Container Quick Start

```bash
docker compose run --rm build
docker compose run --rm test
docker compose run --rm dev
```

## Root Import

```ts
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

```ts
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
    maybe.ts
    either.ts
    validation.ts
    match.ts
  collections/
    stream.ts
    take.ts
  combinators/
    curry.ts
    pipe.ts
    compose.ts
    map.ts
    chain.ts
  monads/
    reader.ts
    effect.ts
  monoids/
    sum.ts
    product.ts
    all.ts
    listMonoid.ts
    foldMap.ts
  index.ts
```

## Exported API

- `combinators`: `curry`, `pipe`, `compose`, `map`, `chain`, `flatMap`
- `adt`: `Maybe`, `Either`, `Validation`, `match`, `matchOrElse`, `matchExhaustive`
- `monads`: `Reader`, `Effect`
- `monoids`: `Sum`, `Product`, `All`, `Any`, `First`, `Last`, `ListMonoid`, `foldMap`
- `collections`: `Stream`, `take`

## Common Helpers

The container-style modules expose a more consistent API:

- `Maybe.of(value)` is an alias for `Maybe.Just(value)`
- `Maybe.toEither(onNothing, value)` converts `Just` to `Right` and `Nothing` to `Left`
- `Maybe.filter(predicate, value)` keeps a `Just` only when the predicate passes
- `Maybe.orElse(fallback, value)` provides a fallback when a value is `Nothing`
- `Either.of(value)` is an alias for `Either.Right(value)`
- `Either.mapLeft(fn, value)` transforms `Left` values without touching `Right`
- `Either.bimap(onLeft, onRight, value)` transforms either branch explicitly
- `Validation.of(value)` is an alias for `Validation.Success(value)`
- `Reader.of(value)` lifts a plain value into a `Reader`
- `Reader.asks(select)` projects a value from the environment
- `Reader.local(transform, reader)` runs a `Reader` against a transformed environment
- `First.of(value)` and `Last.of(value)` create Maybe-backed values for first/last monoids
- `First.fromNullable(value)` and `Last.fromNullable(value)` lift nullable input into those monoid contexts
- `Maybe.fromNullable(value)` converts nullable input into `Just` or `Nothing`
- `Either.fromNullable(value, onNullable)` converts nullable input into `Right` or `Left`
- `fold` is available on `Maybe`, `Either`, and `Validation` instances

## Examples

For a complete root-API walkthrough, see [docs/usage-examples.md](./docs/usage-examples.md) and the runnable [examples/api-overview.js](./examples/api-overview.js).

### Maybe

```ts
const result = Maybe.fromNullable(user)
  .map((value) => value.name)
  .fold(
    () => 'Anonymous',
    (name) => name
  )
```

### Either

```ts
const parsed = Either.fromThrowable(
  () => JSON.parse(input),
  (error) => error.message
)

const message = parsed.fold(
  (error) => `Invalid input: ${error}`,
  (value) => `Loaded ${value.id}`
)

// Backward compatibility: Either.tryCatch remains as an alias.
```

### Reader and Effect

```ts
const readApiBase = Reader.ask().map((env) => env.apiBase)

const fetchConfig = Effect.of('/config.json').map((path) => `${path}?v=1`)
```

### Monoids and Lazy Streams

```ts
const evens = Stream.iterate((n) => n + 2, 0)
const firstFive = take(5, evens)
const total = foldMap(Sum, firstFive)
```

## Development

```bash
npm test
npm run build
npm run setup:git-hooks
```

## Release

Before publishing:

```bash
npm run build
npm publish
```

This package publishes built `dist` output plus generated docs (`docs/api` and `docs/usage-examples.md`), so make sure the build succeeds first.

Tagged releases (`v*`) also publish API docs to GitHub Pages and attach a docs archive to the GitHub Release.

## Containers (Docker Compose)

This repository includes three Docker Compose services in [docker-compose.yml](./docker-compose.yml) for build, test, and interactive development workflows.

### Prerequisites

- Docker and Docker Compose installed
- Run commands from the repository root

### Host UID/GID Mapping (Non-root Writes)

Compose services run as your host user by default pattern: `${LOCAL_UID:-1000}:${LOCAL_GID:-1000}`.
If your local user is not `1000:1000`, export these before running compose:

```bash
export LOCAL_UID=$(id -u)
export LOCAL_GID=$(id -g)
```

The devcontainer is also configured to use a non-root remote user (`node`) with UID/GID sync enabled.

### Services

#### `build`

Purpose: run a CI-style one-shot verification.

What it does:

- Installs dependencies with `npm ci`
- Builds the package with `npm run build`
- Runs tests once with `npm run test`

Run it:

```bash
docker compose run --rm build
```

#### `test`

Purpose: run tests in watch mode during development.

What it does:

- Starts `npm run test -- --watch`
- Keeps an interactive TTY open for watch mode output

Run it:

```bash
docker compose run --rm test
```

#### `dev`

Purpose: open an interactive shell inside the dev container.

What it does:

- Installs dependencies with `npm ci`
- Opens a shell (`sh`) in `/app`

Run it:

```bash
docker compose run --rm dev
```

Inside the shell, common commands are:

```bash
npm test
npm run build
npm run lint
```

### Shared Container Setup

All three services:

- Mount the repository to `/app`
- Use `/app/node_modules` as a container-managed volume
- Run with `/app` as the working directory

This keeps dependency installation isolated in the container while still using live source files from your local workspace.

## Functional Standards

Project standards for functional TypeScript are documented in [FUNCTIONAL_STANDARDS.md](./FUNCTIONAL_STANDARDS.md). Treat the required rules in that document as merge criteria for new code.
