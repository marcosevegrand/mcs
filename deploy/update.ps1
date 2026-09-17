# Deploy by pulling the latest commit from GitHub and rebuilding the container on the VPS.
# Usage: powershell -ExecutionPolicy Bypass -File deploy/update.ps1
$ErrorActionPreference = "Stop"

Write-Host "Pulling latest commit on VPS..." -ForegroundColor Cyan
ssh msc-vps "cd /opt/projects/msc && git fetch origin --prune && git reset --hard origin/master && docker compose build && docker compose up -d"
if ($LASTEXITCODE -ne 0) { throw "remote deploy failed" }

Write-Host "Done. https://mcs.marcosev.com" -ForegroundColor Green
