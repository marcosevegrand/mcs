# Sync local sources to the VPS and rebuild the site.
# Usage: powershell -File deploy/update.ps1
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$tar = Join-Path $env:TEMP "msc-src.tar.gz"

Write-Host "Packing sources..." -ForegroundColor Cyan
tar -czf $tar --exclude=node_modules --exclude=public --exclude=.git --exclude=.quartz --exclude=.quartz-cache -C $root .
if ($LASTEXITCODE -ne 0) { throw "tar failed" }

Write-Host "Uploading..." -ForegroundColor Cyan
scp $tar msc-vps:/opt/projects/msc/msc-src.tar.gz
if ($LASTEXITCODE -ne 0) { throw "scp failed" }

Write-Host "Extracting + rebuilding container..." -ForegroundColor Cyan
ssh msc-vps "cd /opt/projects/msc && tar -xzf msc-src.tar.gz && rm msc-src.tar.gz && docker compose build && docker compose up -d"
if ($LASTEXITCODE -ne 0) { throw "remote build failed" }

Remove-Item $tar -Force
Write-Host "Done. https://mcs.marcosev.com" -ForegroundColor Green
