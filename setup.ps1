#Requires -Version 5.1
$ErrorActionPreference = 'Stop'

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function log($msg) { Write-Host "[setup] $msg" }
function fail($msg) { Write-Error "[setup] ERROR: $msg"; exit 1 }

# --- Node version ---

$nvmrcPath = Join-Path $RootDir '.nvmrc'
if (Test-Path $nvmrcPath) {
    $nodeVersion = (Get-Content $nvmrcPath).Trim()
    if (Get-Command nvm -ErrorAction SilentlyContinue) {
        log "Switching to Node $nodeVersion via nvm..."
        nvm use $nodeVersion
    } else {
        log "nvm not found — skipping Node version switch (wanted $nodeVersion)"
    }
}

# --- Install dependencies ---

log "Installing root dependencies..."
npm install --prefix $RootDir

log "Installing frontend dependencies..."
npm install --prefix "$RootDir\frontend"

log "Installing backend dependencies..."
npm install --prefix "$RootDir\backend"

# --- Build ---

log "Building backend..."
npm run build --prefix "$RootDir\backend"

log "Building frontend..."
npm run build --prefix "$RootDir\frontend"

# --- Verify ---

log "Verifying backend build..."
$backendOut = "$RootDir\backend\dist\index.js"
if (-not (Test-Path $backendOut)) { fail "backend\dist\index.js not found" }

log "Verifying frontend build..."
$frontendDist = "$RootDir\frontend\dist\frontend\browser"
if (-not (Test-Path $frontendDist)) { fail "frontend dist not found at $frontendDist" }
if (-not (Test-Path "$frontendDist\index.html")) { fail "frontend\dist\frontend\browser\index.html not found" }

log "Done. All dependencies installed and builds verified."
