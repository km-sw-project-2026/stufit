#!/usr/bin/env pwsh
Write-Host "=== Apply D1 migration and publish Worker ===`n"

# 1) Apply migration to remote D1 database
Write-Host "-> Applying D1 migration (migrations/20260210_add_challenge_members_status.sql)..."
try {
  npx wrangler d1 execute stufit --file=./migrations/20260210_add_challenge_members_status.sql 2>&1 | Write-Host
  Write-Host "Migration command executed. Check output above for success message."
} catch {
  Write-Host "Migration command failed: $_"
}

# 2) Build project
Write-Host "`n-> Building project (npm run build)..."
try {
  npm run build --silent 2>&1 | Write-Host
  Write-Host "Build finished."
} catch {
  Write-Host "Build failed: $_"
}

# 3) Publish worker
Write-Host "`n-> Publishing worker (npx wrangler publish)..."
try {
  npx wrangler publish 2>&1 | Write-Host
  Write-Host "Publish finished."
} catch {
  Write-Host "Publish failed: $_"
}

Write-Host "`nDone. If any step failed, copy the output and paste it to the developer for assistance."
