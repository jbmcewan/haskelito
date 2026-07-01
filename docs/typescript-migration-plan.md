# TypeScript Migration Plan for `jbmcewan/haskelito`

This document lays out a concrete, low-risk phased plan to migrate the project from JavaScript to TypeScript while preserving behavior and public API compatibility.

## Phase 0 — Baseline + Inventory (0.5 day)

- Freeze current behavior:
  - Ensure tests pass on `main`.
  - Record current Node/version expectations.
- Inventory:
  - List entry points (`package.json` exports, CLI, `main`/`module` fields).
  - Identify core modules vs helpers.
- Add a migration tracking issue/checklist.

**Deliverable:** clear map of files + public API surface.

---

## Phase 1 — TypeScript Scaffolding, No Code Migration Yet (0.5 day)

- Install:
  - `typescript`, `@types/node`, optionally `ts-node`.
- Create `tsconfig.json`:
  - Start with `allowJs: true`, `checkJs: false`, `declaration: true`, `outDir: dist`.
- Add scripts:
  - `typecheck`, `build`, keep existing test script untouched.
- CI:
  - Add `tsc --noEmit` job (allowed to be non-blocking initially).

**Deliverable:** TS toolchain working without changing runtime.

---

## Phase 2 — Publish Type Declarations Early (1 day)

- Add JSDoc types to highest-traffic JS files (likely `src/index.js`, ADT constructors).
- Turn on `checkJs: true` for a subset (via `include`/`exclude`).
- Generate `.d.ts` from JS+JSDoc if feasible.

**Why:** users get editor/type safety before a full rewrite.

**Deliverable:** first typed API docs + declaration artifacts.

---

## Phase 3 — Migrate Core Algebra Modules First (2–3 days)

Prioritize modules likely central to the library identity:

1. `Maybe` / `Either` (or equivalent)
2. Core combinators (`map`, `chain`, `ap`, `fold`, etc.)
3. Shared utilities (currying, function composition)

For each module:
- Rename `.js` → `.ts`
- Add explicit exported types
- Keep runtime semantics and names identical
- Add/keep tests unchanged

**Deliverable:** core typed foundation, zero API breakage.

---

## Phase 4 — Migrate Integration Layer + Index Exports (1–2 days)

- Migrate `src/index.js` to `src/index.ts`.
- Ensure all re-exports preserve existing import paths.
- Verify CJS/ESM compatibility based on current package behavior.
- Add `types` field in `package.json` (and `exports` type paths if used).

**Deliverable:** full typed public entrypoint.

---

## Phase 5 — Tighten Strictness Safely (1–2 days)

- Enable stricter compiler options incrementally:
  - `strict: true`
  - `noUncheckedIndexedAccess`
  - `exactOptionalPropertyTypes`
- Fix surfaced edge cases (especially nullable/union boundaries).
- Keep changes behavior-preserving.

**Deliverable:** stronger compile-time guarantees.

---

## Phase 6 — Docs + Examples Overhaul (1 day)

Update:
- README examples to TypeScript first, JS secondary.
- API signatures shown with generics (`Either<E, A>`, etc.).
- Contributing guide:
  - `npm run typecheck`
  - module/type conventions
- Add “Migration for JS users” note.

**Deliverable:** docs match the new developer experience.

---

## Phase 7 — Haskell-like Enhancements Unlocked by TypeScript (optional, 2–4 days)

After migration stability:
- Add discriminated unions + exhaustive match helpers.
- Add branded/newtype helpers for safer domain values.
- Introduce fp-ts-style HKT encoding (if desired) for generic typeclass combinators.
- Add law test suite structure (Functor/Monad laws) with typed harness.

**Deliverable:** deeper functional abstractions with compile-time safety.

---

## Suggested PR Breakdown (Small, Reviewable)

1. **PR1:** TS tooling + config + CI typecheck
2. **PR2:** JSDoc typings + first `.d.ts` output
3. **PR3:** `Maybe` + `Either` to `.ts`
4. **PR4:** remaining core combinators/utilities
5. **PR5:** entrypoint + package exports/types wiring
6. **PR6:** strictness tightening fixes
7. **PR7:** docs + examples refresh
8. **PR8 (optional):** advanced FP features (HKT/newtypes/laws)

---

## Risks to Watch

- ESM/CJS packaging drift (most common migration issue).
- Hidden API shape changes when adding discriminants.
- Overly strict compiler flags too early.

**Mitigation:** keep runtime tests unchanged and gate each phase with compatibility checks.
