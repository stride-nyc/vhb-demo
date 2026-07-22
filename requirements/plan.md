# PDCA Plan — CCM-5e-ICE: Comment Box for Coders

**Session goal:** After this session, a standalone `CodingCommentButtonComponent` provides a working Comments button (grey/green) and dialog to view and edit `collision.comment`, wired into `CollisionInfoComponent`, backed by a PATCH endpoint, fully tested.

---

## Architecture Pattern Discovery

| Search | Finding |
|---|---|
| `comment` field | Already declared as `comment: string` in both `backend/src/types.ts` and `frontend/src/app/collision.types.ts`. Already present on `collisions.json` record. **No type changes needed.** |
| Existing service patterns | `ApiService.getCollision()` → model for new `saveComment()` |
| Existing backend patterns | `GET /api/collision/:id` → model for new `PATCH /api/collision/:id/comment` |
| Touch points | 7 files: `backend/src/app.ts`, `api.service.ts`, `coding-comment-button.ts/html/scss/spec.ts` (new), `collision-info.ts`, `collision-info.html` |

---

## Implementation Steps (TDD — one failing test at a time)

### Step 1 — Backend: `PATCH /api/collision/:id/comment` ✅

- Added endpoint to `backend/src/app.ts`
- Validates body `{ comment: string }`, mutates `COLLISIONS[id].comment`, returns `{ comment }`
- Tests: 200 happy path, 404 unknown ID, 400 non-string body — all green

### Step 2 — Frontend: `ApiService.saveComment()` ✅

- Added `saveComment(id: string, comment: string): Observable<{ comment: string }>` to `api.service.ts`
- Test: asserts correct PATCH URL and request body via `HttpTestingController` — green

### Step 3 — New component: `CodingCommentButtonComponent` — button only

- Create `frontend/src/app/coding-comment-button/` with `.ts`, `.html`, `.scss`
- `@Input() collisionId: string`
- `@Input() comment: string`
- `@Output() commentSaved = new EventEmitter<string>()`
- Button: `comments-btn` class; `comments-btn--has-comment` added when `comment` is non-empty
- **Test first** (`coding-comment-button.spec.ts`):
  - Button is present in the DOM
  - Has grey class when `comment` is `""`
  - Has green class when `comment` has a value
- Acceptance: tests green, `tsc` clean

### Step 4 — Add dialog to `CodingCommentButtonComponent`

- Add `dialogOpen`, `draftComment`, `openDialog()`, `closeDialog()`, `saveComment()` to component class
- Import `FormsModule` and `inject(ApiService)`
- `openDialog()` copies `comment` input into `draftComment`
- `saveComment()` calls `ApiService.saveComment(collisionId, draftComment)`, on success emits `commentSaved` and closes
- Add `@if (dialogOpen)` overlay: dark-header modal, `<textarea [(ngModel)]="draftComment">`, Ok / Cancel
- **Test first**:
  - `openDialog()` sets `draftComment` to current `comment` input value
  - `closeDialog()` resets `dialogOpen` and `draftComment` without emitting
  - `saveComment()` calls service with correct args and emits on success
  - Cancel leaves `commentSaved` un-emitted
- Acceptance: full dialog workflow tested, tests green

### Step 5 — Wire into `CollisionInfoComponent`

- Import `CodingCommentButtonComponent` in `collision-info.ts`
- Add `<app-coding-comment-button>` to `collision-info.html` inside the action bar
- Bind `[collisionId]="collision.collisionId | string"` and `[comment]="collision.comment"`
- On `(commentSaved)` update `collision.comment`
- **Test first** (`collision-info.spec.ts`):
  - `CodingCommentButtonComponent` is rendered when collision is set
  - `collision.comment` updates when `commentSaved` fires
- Acceptance: tests green, full suite green

---

## Definition of Done

- [ ] `cd frontend && npx ng test --watch=false` — all tests green
- [ ] No TS errors in any touched file
- [ ] Button is grey when `comment` is empty string; green when non-empty
- [ ] Cancel does not emit `commentSaved`
- [ ] Ok saves and `CollisionInfoComponent` reflects the updated comment immediately

## Risk Areas

- `COLLISIONS` is a JSON import — object mutation persists within the server process (verified in Step 1)
- `@Input() comment` is a primitive string — Angular change detection will re-render the button state correctly without needing `OnPush`
- `collisionId` must be passed as a string to match the API service signature (`collision.collisionId` is a number — use string interpolation in the template)

## Rollback

Steps 1–2 already committed. Steps 3–5 are isolated to new files + minimal changes to `collision-info.ts/html`. `git checkout` on any touched file fully reverts.

---

> **To execute each step, invoke the PDCA Do phase. Do not begin any step without first opening that prompt.**
