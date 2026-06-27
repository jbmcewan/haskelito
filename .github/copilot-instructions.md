# Copilot Instructions

- Make the smallest possible change that solves the request.
- Search narrowly (`rg`) and read only required files.
- No speculative refactors, style churn, or unnecessary dependencies.
- Respect module boundaries: `src/adt`, `src/combinators`, `src/monads`, `src/monoids`, `src/collections`.
- Keep side effects at boundaries; model effectful logic with `Effect`/`Reader`.
- Prefer ADTs (`Maybe`, `Either`, `Validation`) over null/undefined control flow.
- Keep exported values immutable (freeze constructor outputs).
- Preserve public API in `src/index.js` unless explicitly asked to change it.
- Validate boundary inputs; fail fast with clear errors.
- When algebraic behavior changes, update tests for laws and success/failure paths.
