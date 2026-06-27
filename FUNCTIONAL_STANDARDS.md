# Functional Programming Standards for JavaScript

This document defines required and recommended functional programming standards for this repository.

## 1. Rule Levels

- Required: Must be met for production changes.
- Recommended: Preferred when practical, but may be traded off for clarity or performance.

## 2. Core Principles

Required:

- Favor pure functions: outputs depend only on inputs.
- Preserve referential transparency for domain logic.
- Keep side effects at program boundaries.
- Prefer function composition over imperative orchestration.

Recommended:

- Keep functions small and single-purpose.
- Use point-free style only when readability improves.

## 3. Data Modeling Standards

Required:

- Use ADTs (for example Maybe, Either, Validation) for branching domain states.
- Avoid null and undefined as control flow signals in domain logic.
- Expose immutable values from constructors (freeze public objects).

Recommended:

- Prefer explicit domain types over ad-hoc object tags.

Good:

```js
const displayName = Maybe.fromNullable(user)
  .map((value) => value.name)
  .getOrElse('Anonymous')
```

Avoid:

```js
const displayName = user && user.name ? user.name : 'Anonymous'
```

## 4. API Design Standards

Required:

- Public combinators should be predictable and composable.
- Curried APIs are preferred for reusable combinators.
- Validate boundary inputs and fail fast with clear errors.
- Do not mutate exported module objects after declaration.

Recommended:

- Keep naming consistent across structures: of, map, flatMap, fold, ap.

## 5. Effect Handling Standards

Required:

- I/O, logging, and async integration must be explicit.
- Keep effect execution separate from transformation logic.
- Wrap effectful flows in dedicated abstractions (for example Effect, Reader).

Recommended:

- Keep unsafe operations in a narrow shell around pure code.

Good:

```js
const loadUser = Effect.tryCatch(() => fetch('/user').then((r) => r.json()), String)
const userName = loadUser.map((user) => user.name)
```

## 6. Totality and Error Handling

Required:

- Prefer total functions where possible.
- For partial operations, provide safe alternatives.
- Errors should be explicit and observable, not silently ignored.

Recommended:

- Keep both safe and unsafe variants clearly named.

## 7. Lawfulness Requirements

Required for structures that claim these interfaces:

- Functor laws: identity, composition.
- Applicative laws (where applicable): identity, homomorphism, interchange, composition.
- Monad laws: left identity, right identity, associativity.
- Monoid laws: left identity, right identity, associativity.

Lawfulness should be validated in tests for each exported abstraction.

## 8. Testing Requirements

Required:

- Add behavior tests for public API changes.
- Add or update law tests when type-class-like behavior is touched.
- Cover both success and failure branches for ADTs.

Recommended:

- Keep law tests deterministic and easy to read.

## 9. Contribution Checklist

Before merge, verify:

- Pure core logic and explicit side-effect boundaries.
- Immutable ADT and monad values.
- Boundary input checks for new public functions.
- Updated law tests for affected abstractions.
- Updated docs when adding new functional constructs.

## 10. Module Mapping in This Repo

- ADT modeling: src/adt
- Function combinators: src/combinators
- Effect orchestration: src/monads
- Algebraic reduction: src/monoids
- Lazy collections: src/collections
