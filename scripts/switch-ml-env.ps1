param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("local", "remote")]
    [string]$Mode
)

$repoRoot = Split-Path -Parent $PSScriptRoot

if ($Mode -eq "local") {
    $sourceFile = Join-Path $repoRoot ".envDevelopment.local-ml"
    $targetMlUrl = "http://localhost:8000"
} else {
    $sourceFile = Join-Path $repoRoot ".envDevelopment.remote-ml"
    $targetMlUrl = "https://fake-news-ml-service.onrender.com"
}

$targetFile = Join-Path $repoRoot ".envDevelopment"

if (-not (Test-Path $sourceFile)) {
    Write-Error "Source file not found: $sourceFile"
    exit 1
}

Copy-Item -Path $sourceFile -Destination $targetFile -Force

Write-Host "Switched .envDevelopment to $Mode ML mode."
Write-Host "ML_SERVICE_URL => $targetMlUrl"
Write-Host "Restart backend after switching."
