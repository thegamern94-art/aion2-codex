# Publishes AION 2 Codex to GitHub Pages (public repo: aion2-codex).
# One-time prerequisite: gh auth login  (GitHub.com > HTTPS > Yes > Login with a web browser)
# Then run:  .\publish.ps1

$ErrorActionPreference = 'Stop'
$repo = 'aion2-codex'

# 0) Auth check
cmd /c "gh auth status >nul 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-Host 'GitHub CLI is not logged in on this machine.' -ForegroundColor Yellow
    Write-Host 'Run:  gh auth login   (GitHub.com > HTTPS > Yes > Login with a web browser)'
    Write-Host 'Then run this script again:  .\publish.ps1'
    exit 1
}

$owner = gh api user --jq .login
Write-Host "Authenticated as: $owner"

# 1) Create the public repo (additive only - nothing else is touched)
cmd /c "gh repo view $owner/$repo >nul 2>&1"
if ($LASTEXITCODE -ne 0) {
    gh repo create $repo --public --description 'AION 2 Codex - fast MMO guide, build planner and database (GitHub Pages)' | Out-Null
    Write-Host "Created public repo $owner/$repo."
} else {
    Write-Host "Repo $owner/$repo already exists - skipping creation."
}

# 2) Enable Pages with GitHub Actions as the source (idempotent)
cmd /c "gh api repos/$owner/$repo/pages -X POST -f build_type=workflow >nul 2>&1"
if ($LASTEXITCODE -eq 0) {
    Write-Host 'Pages enabled (source: GitHub Actions).'
} else {
    Write-Host 'Pages enable skipped (already enabled or still propagating).'
}

# 3) Push main (the push triggers .github/workflows/deploy.yml)
if (git remote) {
    git remote set-url origin "https://github.com/$owner/$repo.git"
} else {
    git remote add origin "https://github.com/$owner/$repo.git"
}
git push -u origin main

# 4) Watch the first deployment
Write-Host 'Waiting for the workflow to register...'
Start-Sleep -Seconds 10
$runId = gh run list --repo "$owner/$repo" --limit 1 --json databaseId --jq '.[0].databaseId'
if (-not $runId) {
    Start-Sleep -Seconds 15
    $runId = gh run list --repo "$owner/$repo" --limit 1 --json databaseId --jq '.[0].databaseId'
}
if ($runId) {
    Write-Host "Watching run $runId (2-4 minutes on first deploy)..."
    gh run watch $runId --repo "$owner/$repo" --exit-status
    if ($LASTEXITCODE -eq 0) {
        Write-Host ''
        Write-Host "Deployed! Site: https://$owner.github.io/$repo/" -ForegroundColor Green
    } else {
        Write-Host ''
        Write-Host "Deploy FAILED - logs: gh run view $runId --repo $owner/$repo --log-failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host 'No run detected yet - check: https://github.com/'"$owner/$repo"'/actions'
}
