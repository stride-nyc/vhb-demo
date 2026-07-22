# PDCA Plan — CCM-5e-ICE: Comment Box for Coders

**Session goal:** After this session, the `CollisionInfoComponent` has a working Comments button (grey/green) that opens a dialog to view and edit `collision.comment`, backed by a PATCH endpoint, fully tested.

---

## Architecture Pattern Discovery

| Search | Finding |
|---|---|
| `comment` field | Already declared as `comment: string` in both `backend/src/types.ts` and `frontend/src/app/collision.types.ts`. Already present on `collisions.json` record. **No type changes needed.** |
| Existing service patterns | `ApiService.getCollision()` → model for new `saveComment()` |
| Existing backend patterns | `GET /api/collision/:id` → model for new `PATCH /api/collision/:id/comment` |
| Touch points | 5 files: `backend/src/app.ts`, `api.service.ts`, `collision-info.ts`, `collision-info.html`, `collision-info.scss` |

---

## Implementation Steps (TDD — one failing test at a time)

### Step 1 — Backend: `PATCH /api/collision/:id/comment`

- Add endpoint to `backend/src/app.ts`
- Validates body `{ comment: string }`, mutates `COLLISIONS[id].comment`, returns `{ comment }`
- **Test first** (`backend/src/__tests__/collision.test.ts`):
  - PATCH `2202633` with a new comment → 200 + `{ comment }`
  - Unknown ID → 404
  - Non-string body → 400
- Acceptance: tests green, `tsc` clean

### Step 2 — Frontend: `ApiService.saveComment()`

- Add `saveComment(id: string, comment: string): Observable<{ comment: string }>` to `api.service.ts`
- **Test first** (`api.service.spec.ts`): assert correct PATCH URL (`/api/collision/2202633/comment`) and request body via `HttpTestingController`
- Acceptance: tests green, `tsc` clean

### Step 3 — UI: bottom action bar + Comments button

- Add `.coding-action-bar` at the bottom of `collision-info.html` (inside `@if (collision)`)
- Button: grey by default; `comments-btn--has-comment` class when `collision.comment` is non-empty
- Expose `get hasComment()` and `openDialog()` stub (no-op) in `collision-info.ts`
- **Test first** (`collision-info.spec.ts`):
  - Button is present
  - Grey class when `comment` is `""`
  - Green class when `comment` has a value
- Acceptance: tests green, button renders correctly

### Step 4 — UI: Comments dialog

- Import `FormsModule` and `inject(ApiService)` in `CollisionInfoComponent`
- Add `dialogOpen`, `draftComment`, `openDialog()`, `closeDialog()`, `saveComment()` to class
- `openDialog()` pre-populates `draftComment` from `collision.comment`
- `saveComment()` calls `api.saveComment()`, on success sets `collision.comment` and closes
- Add `@if (dialogOpen)` overlay: dark-header modal, `<textarea [(ngModel)]="draftComment">`, Ok / Cancel
- **Test first**:
  - `openDialog()` sets `draftComment` to current `collision.comment`
  - `closeDialog()` resets `draftComment` and closes
  - `saveComment()` updates `collision.comment` on service success
  - Cancel leaves `collision.comment` unchanged
- Acceptance: full workflow end-to-end, tests green

---

## Definition of Done

- [ ] `cd frontend && npx ng test --watch=false` — all tests green
- [ ] No TS errors in any touched file
- [ ] Button is grey when `comment` is empty string; green when non-empty
- [ ] Cancel does not mutate `collision.comment`
- [ ] Ok saves and reflects updated comment immediately in the panel

## Risk Areas

- `COLLISIONS` is a JSON import — confirm object mutation persists within the server process, or wrap in a mutable copy in `collision-store.ts`
- `collision!.comment = ...` inside the subscribe callback requires non-null assertion; verify `collision` cannot be nulled between open and save

## Rollback

All changes are isolated to the 5 files listed above. `git checkout` on any of them fully reverts.

---

> **To execute each step, invoke the PDCA Do phase. Do not begin any step without first opening that prompt.**
