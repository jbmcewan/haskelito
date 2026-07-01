# PR1 Patch Plan (Repo-Specific): TypeScript Tooling + Config + CI Typecheck

This PR is intentionally scoped to infrastructure only: **no behavior changes**, no JS→TS rewrites yet.  
Goal: establish TypeScript in `jbmcewan/haskelito` so later migration PRs are small and safe.

## PR1 Scope

- Add TypeScript compiler and baseline typings.
- Add initial `tsconfig.json` configured for incremental migration.
- Add `typecheck` and `build` scripts.
- Add/adjust CI to run a non-invasive typecheck (`tsc --noEmit`).
- Keep existing runtime/test pipeline intact.

## Non-Goals (for PR1)

- No module renames from `.js` to `.ts` yet.
- No strict mode rollout yet.
- No export surface changes.
- No public API behavior changes.

---

## Step 1: Inspect current package/CI shape before patching

Before editing, confirm these in current repo state:

1. `package.json`
   - package manager (`npm`, `pnpm`, etc.)
   - scripts (`test`, `lint`, `build`)
   - module mode (`"type": "module"` or CJS default)
2. CI workflow file(s)
   - path in `.github/workflows/*`
   - current install and test commands
   - Node versions in matrix (if any)

> Keep PR1 aligned with the current conventions already used by the repo.

---

## Step 2: Add dependencies

Add dev dependencies:

- `typescript`
- `@types/node`

Optional in PR1 (only if repo workflow benefits immediately):

- `ts-node` (if any scripts expect TS runtime execution)
- `tsx` (alternative dev runner)

### Example install commands

Use whichever tool repo already uses:

- npm: `npm i -D typescript @types/node`
- pnpm: `pnpm add -D typescript @types/node`
- yarn: `yarn add -D typescript @types/node`

---

## Step 3: Add `tsconfig.json` (incremental-migration baseline)

Create a conservative config that allows existing JS to remain untouched.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "allowJs": true,
    "checkJs": false,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "outDir": "dist",
    "rootDir": ".",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmitOnError": true
  },
  "include": ["src", "test", "tests", "*.js", "*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Notes for this repo

- If package is currently CJS, switch `module/moduleResolution` to a CJS-friendly pair (e.g., `CommonJS`/`Node`).
- If test directory differs, update `include`.
- Keep `strict: false` for PR1 to reduce churn; strictness comes later.

---

## Step 4: Update `package.json` scripts (minimal set)

Add:

- `"typecheck": "tsc --noEmit"`
- `"build": "tsc -p tsconfig.json"`

Keep existing scripts unchanged.

### Example snippet

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsc -p tsconfig.json"
  }
}
```

If `build` already exists for bundling/transpile, prefer:

- keep existing `build` as-is
- add `"build:types": "tsc -p tsconfig.json"`  
and use that in later phases.

---

## Step 5: CI integration (non-blocking or soft-start)

Update existing workflow to include a TypeScript check job or step:

1. install deps
2. run existing tests as-is
3. run `typecheck`

### Suggested CI step

```yaml
- name: Type check
  run: npm run typecheck
```

If your CI has matrix runs, include typecheck in one primary Node version first (to keep runtime cost low).

---

## Step 6: Validate locally before pushing

Run:

1. install command
2. `npm run typecheck`
3. existing test command (`npm test` or repo equivalent)

Expected for PR1:

- typecheck passes
- existing tests still pass
- no runtime behavior changes

---

## Step 7: PR description template (use in PR1)

## Summary
Add baseline TypeScript tooling and CI typecheck for incremental migration.

## Changes
- Add TypeScript + Node typings as dev dependencies.
- Add `tsconfig.json` configured for mixed JS/TS repo.
- Add `typecheck` script (`tsc --noEmit`).
- Add TS build script (or `build:types`).
- Add CI typecheck step.

## Why now
This establishes safe scaffolding for phased JS→TS migration without changing behavior.

## Out of scope
- No source conversion `.js`→`.ts`
- No strictness rollout
- No API changes

## Validation
- Existing test suite unchanged and passing.
- `npm run typecheck` passes in CI.

---

## Acceptance Criteria for PR1

- [ ] `tsconfig.json` exists and is valid for current module system.
- [ ] `typescript` + `@types/node` present in devDependencies.
- [ ] `typecheck` script added and runnable.
- [ ] CI runs typecheck.
- [ ] Existing tests still pass.
- [ ] No source behavior changes.

---

## Follow-up (PR2 preview)

After PR1 merges, PR2 will:

- add JSDoc type annotations in highest-traffic modules,
- optionally enable targeted `checkJs`,
- generate first useful `.d.ts` outputs for consumers.
