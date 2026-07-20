# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

## Build & Test

```bash
cd frontend && npx ng test --watch=false   # full frontend suite
cd frontend && npx ng test --include='**/path/to/file.spec.ts' --watch=false  # single spec
```

## Architecture Overview

Angular 22 SPA (`frontend/`) + Express/TypeScript API (`backend/`). No database yet.

- Root component: `frontend/src/app/app.ts`
- Map feature: `frontend/src/app/map/`
- Collision info panel: `frontend/src/app/collision-info/`
- Backend entry: `backend/src/index.ts`
- Collision data: `backend/src/data/collisions.json`

## Conventions & Patterns

Follow `/afb-tdd` (red-green-refactor) for all feature work. See `.claude/skills/afb-tdd/` for the full loop.

---

