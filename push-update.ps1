# PS Optical - Quick GitHub Sync Script
param (
    [string]$Message
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   PS OPTICAL - GITHUB SYNC TOOL          " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Verify git is available, auto-add to PATH if needed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    $fallbackGit = "$env:LOCALAPPDATA\Programs\Git\cmd"
    if (Test-Path "$fallbackGit\git.exe") {
        $env:Path = "$fallbackGit;$env:Path"
    } elseif (Test-Path "C:\Program Files\Git\cmd\git.exe") {
        $env:Path = "C:\Program Files\Git\cmd;$env:Path"
    } else {
        Write-Host "❌ Git is not found in PATH. Please ensure Git is installed." -ForegroundColor Red
        exit 1
    }
}

# 2. Check if git repository is initialized
if (-not (Test-Path ".git")) {
    Write-Host "⚠️ Git is not initialized in this folder. Initializing..." -ForegroundColor Yellow
    git init -b main
}

# 3. Check for unstaged/uncommitted changes
$changes = git status --porcelain
if (-not $changes) {
    Write-Host "✅ No changes detected. Everything is already up to date!" -ForegroundColor Green
    exit 0
}

Write-Host "📁 Pending changes detected:" -ForegroundColor Yellow
git status -s

# 4. Prompt for message if not provided
if ([string]::IsNullOrWhiteSpace($Message)) {
    $defaultMsg = "Update: " + (Get-Date -Format "yyyy-MM-dd HH:mm")
    Write-Host ""
    $inputMsg = Read-Host "Enter commit message [Press Enter for '$defaultMsg']"
    if ([string]::IsNullOrWhiteSpace($inputMsg)) {
        $Message = $defaultMsg
    } else {
        $Message = $inputMsg
    }
}

Write-Host ""
Write-Host "🚀 Adding files to staging..." -ForegroundColor Cyan
git add .

Write-Host "💾 Committing changes: '$Message'..." -ForegroundColor Cyan
git commit -m "$Message"

# 5. Check if remote is configured
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host ""
    Write-Host "⚠️ No GitHub remote URL linked yet!" -ForegroundColor Yellow
    Write-Host "To link your GitHub repository, run:" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/<your-username>/<repo-name>.git" -ForegroundColor Green
    Write-Host "  git push -u origin main" -ForegroundColor Green
    exit 0
}

Write-Host "🌐 Pushing to GitHub ($remoteUrl)..." -ForegroundColor Cyan

# Get current branch
$branch = git rev-parse --abbrev-ref HEAD
if (-not $branch) { $branch = "main" }

# Push with upstream tracking if needed
$pushResult = git push origin $branch 2>&1
if ($LASTEXITCODE -ne 0) {
    # If upstream not set, try -u
    git push -u origin $branch
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "🎉 Successfully pushed updates to GitHub!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Please check your GitHub permissions or network." -ForegroundColor Red
}
