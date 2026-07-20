# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:6cd5cc61 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- `bd` is available for cross-session issue tracking; use it alongside TaskCreate and standard tools
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

Follow the global CLAUDE.md working agreements. Pushing and committing require explicit human confirmation per the global process discipline rules.
<!-- END BEADS INTEGRATION -->


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

