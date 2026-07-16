---
name: afb-tdd
description: Interactive red-green-refactor TDD workflow. Invoke when writing new features or fixing bugs test-first.
user-invocable: true
allowed-tools: Bash
---

**Setup vs. the loop:** if invoked as `/afb-tdd setup`, **or** if the user asks — now or in any follow-up — to *set up*, *bootstrap*, or *initialize* a project-local afb-tdd skill, then do not run the red-green loop: read [references/setup-mode.md](.claude/skills/afb-tdd/references/setup-mode.md), follow it, then stop. (The test-suite audit runs by default; pass `--simple` if they want a quick scaffold without it.) Otherwise, ignore setup and start the loop here.

## Project-specific

**Stack:** Angular 22 frontend (Karma/Jasmine; Vitest installed but unused), Express/TypeScript backend (no test framework yet), Leaflet maps.

### Conventions
- [frontend conventions](.claude/skills/afb-tdd/references/conventions/frontend.md)
- [vitest conventions](.claude/skills/afb-tdd/references/conventions/vitest.md) — reference if/when Vitest is wired for frontend or backend

### Architecture — where a feature lives

- `frontend/` — Angular 22 SPA. Entry: `frontend/src/main.ts`, root component `frontend/src/app/app.ts`, map feature at `frontend/src/app/map/`.
- `backend/` — Express/TypeScript API. Entry: `backend/src/index.ts`. No database yet.

External / linked docs: none.

### Outside-in slice order for a user-facing feature

Each step is its own red-green-refactor cycle. We plan to add an E2E framework — once added, start here:
1. **E2E spec** (Playwright or Cypress — add framework first)
2. **Angular component spec** — Karma/Jasmine, `ng test`
3. **Backend integration/unit test** — add a test framework to `backend/` first (Jest or Vitest)

For backend-only changes with no UI, start at step 3.

### Commands

Use the narrowest target for the layer under test; run the full gate before calling a cycle done.

- Full suite (frontend): `cd frontend && npx ng test --watch=false`
- Single spec file: `cd frontend && npx ng test --include='**/map/map.spec.ts' --watch=false`
- Gate (run before green): same as full suite
- Backend tests: no test command yet — add a test framework before writing backend tests
- DB setup: none — backend has no database yet

### Test infrastructure to reuse

No canonical helpers exist yet — greenfield test suite.

When writing new component specs, follow the `map.spec.ts` pattern:
- Declare a typed mock factory (e.g. `makeLeafletMock()`) that returns named spy handles
- Declare `fixture`, `component`, and `mocks` as `let` at `describe` scope; populate in `beforeEach`
- Assert behavioral outcomes (spy call args, call counts, teardown) — not just DOM existence

### Domain gotchas

- **Leaflet mocking:** Any component that touches the map must inject Leaflet via the `LEAFLET` injection token and provide a mock in `TestBed`. Always capture the factory return value — discarding it makes behavioral assertions impossible.
- **No database yet:** Backend is pure Express; no DB setup/teardown needed.
- **E2E framework not yet installed:** Before writing E2E specs, install and configure Playwright or Cypress.

### Commits
- Do not attribute commits to Claude or list it as a co-author.

### Test helpers & gold-standard files

**Gold standard:** `frontend/src/app/map/map.spec.ts`
- Lines 6–21: typed mock factory with named spy handles
- Lines 23–38: `describe`-scoped shared variables populated in `beforeEach`
- Lines 50–76: behavioral spy assertions — exact call args, `jasmine.objectContaining`, call counts, lifecycle teardown verification

### Known deviations

**`app.spec.ts` — structural smoke tests only (not behavioral):**
- Component re-created inside each `it` block instead of once in `beforeEach`
- Mock factory return value discarded — no spy handles, no behavioral assertions possible
- All assertions are `querySelector(...).toBeTruthy()` — suite passes even with broken `ngOnInit`

### Don't imitate this file

`frontend/src/app/app.spec.ts` — mock factory return is discarded, component is recreated per test, every assertion is a DOM-existence check. Structurally incapable of catching logic bugs. Copy `map.spec.ts` instead.

---

## Before You Start

Determine which layer to begin at (see [test-patterns.md](.claude/skills/afb-tdd/references/test-patterns.md)):
- **Has user-facing behaviour?** Start with a Playwright/Cypress E2E spec (install framework first).
- **Frontend-only change?** Start with an Angular component spec (`ng test`).
- **Backend feature with no UI?** Start with a backend integration or unit test (add test framework first).
- **Bug fix?** Write a failing test that reproduces the bug first — before touching any code.

Then follow this strict red-green-refactor loop. Do not skip or combine steps.

**Autonomous mode:** when invoked as `/afb-tdd --auto`, or when running non-interactively (headless `-p`), do not pause for user confirmation at the end of Red/Green/Refactor. Still produce the same report at each pause point (called shot, failure output, results), then continue. At the end of each Refactor step, make a git commit with message `tdd(cycle N): <behaviour>`. Every other rule is unchanged.

## Test Sequencing

When starting a new behaviour, work in this order:
1. **Degenerate/zero case** — establishes the API shape
2. **1–2 exception/error cases** — defines the valid input contract
3. **Happy path incrementally** — Fake It first, then Obvious Implementation
4. **Remaining exception cases** — once the core is established

## Red
1. Before writing the test, declare your called shot:
   - **Test name:** [descriptive name]
   - **Behaviour under test:** [observable behaviour]
   - **Expected failure:** [exact assertion message when red]

   A mismatch between predicted and actual failure is a stop condition — delete the test and reconsider.
2. Write exactly one failing test — the smallest slice of behaviour that adds value.
3. Run the tests yourself. Check whether the test fails for the right reason (not due to a typo or syntax error).
   - If it passes immediately, or fails for the wrong reason, delete the test and start over with the same goal. Do not leave broken test code for the user to deal with.
4. **Sceptic** (on by default; skipped only when the user invoked `/afb-tdd --no-sceptic` or asked to skip it — sticky for the session): launch one read-only subagent following the RED checkpoint in [sceptic.md](.claude/skills/afb-tdd/references/sceptic.md). Address every finding: fix blockers and rerun the test; rebut anything you disagree with. One round only — never re-sceptic a fix.
5. Report the failure output and confirm it's failing correctly, then wait for the user to confirm before continuing. The report must contain a `Sceptic:` section — findings verbatim with your response to each, `CLEAN`, or `SKIPPED (--no-sceptic)`.

## Green
1. Write the minimum implementation to make the test pass. Nothing more. Hardcode if possible, don't make it handle future scenarios. State which you're doing: **Fake It** (will triangulate next cycle) or **Obvious Implementation**.
2. Run the tests yourself. Check whether the new test passes and all other tests remain green.
   - If something unexpected is failing, fix it before reporting to the user.
3. **Sceptic**: same as Red step 4, but the GREEN checkpoint in [sceptic.md](.claude/skills/afb-tdd/references/sceptic.md).
4. Report the results and wait for the user to confirm before continuing. The report must contain a `Sceptic:` section — findings verbatim with your response to each, `CLEAN`, or `SKIPPED (--no-sceptic)`.

## Refactor
1. Now that tests are green, clean up thoroughly — names, duplication, extraction of well-named helpers. Do not defer this to a later cycle.
2. Only refactor while green. Never refactor while red.
3. Remove any tests that now provide redundant coverage or that didn't fail for the right reason.
4. Run the full test suite to verify no unintended side effects across the whole codebase.
5. Ask the user if they want to commit the cycle, wait for their input, and once they give you the go-ahead, return to Red for the next slice.

## Component Extraction

When extracting a component out of an existing page or parent component, assert the **contract, not the boundary**. The parent's job is to pass a piece of data down and see it represented in the output — it should not care *which* child component renders it.

1. In the **parent's test file**, pass in a distinguishing piece of data and assert that data is **visible** in the rendered output. Do not assert on the component's identity or structure.
2. Choose data that is unique enough to query unambiguously and that the parent genuinely owns.
3. Redraw the ownership boundary carefully: the parent asserts only *that its data shows up*; the child's own test file owns *how* it's formatted, styled, and laid out.

**Fallback — `data-testid`:** only when there is no user-visible data to key on (purely presentational extraction). Add `data-testid="<component-name>"` to the extracted component's root and assert presence only, never internal content.

## Rules
- NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.
- If you wrote code before a test existed, delete it entirely. Do not adapt it — unverified code is technical debt.
- Never write a `catch` or error case without a failing test for it first.
- Each cycle should cover zero, one, or many — prefer the smallest slice.
- Tests written first answer "what *should* this do?". Tests written after only answer "what *does* this do?" — they prove nothing.
- If you find yourself thinking "just this once" about skipping a step, that is a red flag. Stop and restart the cycle properly.
- Each cycle is deliberately small. This is especially important when working with an AI assistant: small context = higher accuracy. Don't batch cycles together.

See [sceptic.md](.claude/skills/afb-tdd/references/sceptic.md) for the adversarial review rubric.
See [test-patterns.md](.claude/skills/afb-tdd/references/test-patterns.md) for outside-in layer ordering, contract testing fakes, and when to use each type of test double.
See [conventions/frontend.md](.claude/skills/afb-tdd/references/conventions/frontend.md) for frontend test conventions — selectors, structure, factories, async patterns.
See [conventions/vitest.md](.claude/skills/afb-tdd/references/conventions/vitest.md) for Vitest-specific conventions — reference if Vitest is wired up.
See [testing-anti-patterns.md](.claude/skills/afb-tdd/references/testing-anti-patterns.md) for guidance on what not to do with mocks and test structure.
See [tdd-checklist.md](.claude/skills/afb-tdd/references/tdd-checklist.md) for the completion checklist and a "when stuck" reference.
