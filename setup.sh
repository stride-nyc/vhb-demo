#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { echo "[setup] $*"; }
fail() { echo "[setup] ERROR: $*" >&2; exit 1; }

# --- Node version ---

NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  source "$NVM_DIR/nvm.sh"
  log "Switching to Node $(cat "$ROOT_DIR/.nvmrc") via nvm..."
  nvm use --prefix "$ROOT_DIR" 2>/dev/null || nvm use "$(cat "$ROOT_DIR/.nvmrc")"
fi

# --- Install dependencies ---

log "Installing root dependencies..."
npm install --prefix "$ROOT_DIR"

log "Installing frontend dependencies..."
npm install --prefix "$ROOT_DIR/frontend"

log "Installing backend dependencies..."
npm install --prefix "$ROOT_DIR/backend"

# --- Build ---

log "Building backend..."
npm run build --prefix "$ROOT_DIR/backend"

log "Building frontend..."
npm run build --prefix "$ROOT_DIR/frontend"

# --- Verify ---

log "Verifying backend build..."
[[ -f "$ROOT_DIR/backend/dist/index.js" ]] || fail "backend/dist/index.js not found"

log "Verifying frontend build..."
FRONTEND_DIST="$ROOT_DIR/frontend/dist/frontend/browser"
[[ -d "$FRONTEND_DIST" ]] || fail "frontend dist not found at $FRONTEND_DIST"
[[ -f "$FRONTEND_DIST/index.html" ]] || fail "frontend/dist/frontend/browser/index.html not found"

log "Done. All dependencies installed and builds verified."