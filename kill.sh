#!/usr/bin/env bash
set -euo pipefail

log() { echo "[kill] $*"; }

killed=0

# Backend: ts-node-dev / node running on port 3000
if pgrep -f "ts-node-dev.*backend" > /dev/null 2>&1; then
  pkill -f "ts-node-dev.*backend" && log "Stopped backend (ts-node-dev)" && ((killed++)) || true
fi

if lsof -ti tcp:3000 > /dev/null 2>&1; then
  lsof -ti tcp:3000 | xargs kill && log "Killed process on port 3000" && ((killed++)) || true
fi

# Frontend: Angular dev server on port 4200
if pgrep -f "ng serve" > /dev/null 2>&1; then
  pkill -f "ng serve" && log "Stopped frontend (ng serve)" && ((killed++)) || true
fi

if lsof -ti tcp:4200 > /dev/null 2>&1; then
  lsof -ti tcp:4200 | xargs kill && log "Killed process on port 4200" && ((killed++)) || true
fi

if [[ $killed -eq 0 ]]; then
  log "Nothing running."
else
  log "Done."
fi
