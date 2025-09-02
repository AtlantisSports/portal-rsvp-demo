#!/usr/bin/env pwsh

# UWH Portal Development Setup Script
# Run this to quickly set up or reset your development environment
# Compatible with PowerShell 7

#Requires -Version 7.0

Write-Host "🏒 UWH Portal - Development Setup (PowerShell 7)" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this from the web-app directory." -ForegroundColor Red
    exit 1
}

# Function to check if development server is running
function Test-DevServer {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

# Kill any existing development servers
Write-Host "🔍 Checking for existing development servers..." -ForegroundColor Yellow
$viteProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
    $_.ProcessName -eq "node" -and $_.CommandLine -like "*vite*" 
}
if ($viteProcesses) {
    Write-Host "🛑 Stopping existing Vite processes..." -ForegroundColor Yellow
    $viteProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# Create backup of current App.tsx
if (Test-Path "src\App.tsx") {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupFile = "src\App-backup-$timestamp.tsx"
    Copy-Item "src\App.tsx" $backupFile -ErrorAction SilentlyContinue
    Write-Host "✅ Backup created: $backupFile" -ForegroundColor Green
}

# Ensure we have a working App.tsx
if (!(Test-Path "src\App.tsx") -or (Get-Content "src\App.tsx" -Raw -ErrorAction SilentlyContinue) -match "Adjacent JSX elements must be wrapped") {
    if (Test-Path "src\App-backup-working.tsx") {
        Write-Host "🔧 Restoring from working backup..." -ForegroundColor Yellow
        Copy-Item "src\App-backup-working.tsx" "src\App.tsx" -ErrorAction SilentlyContinue
        Write-Host "✅ Restored working App.tsx" -ForegroundColor Green
    } else {
        Write-Host "❌ Error: No working backup found and App.tsx has issues" -ForegroundColor Red
        exit 1
    }
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start development server
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "   Server will be available at: http://localhost:5173/" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start in background and check if it's working
$job = Start-Job -ScriptBlock { npm run dev }
Start-Sleep -Seconds 5

if (Test-DevServer) {
    Write-Host "✅ Development server is running successfully!" -ForegroundColor Green
    Write-Host "🌐 Open http://localhost:5173/ in your browser" -ForegroundColor Cyan
    
    # Open browser automatically (PowerShell 7 compatible)
    if ($IsWindows) {
        Start-Process "http://localhost:5173/"
    }
} else {
    Write-Host "⚠️  Development server may be starting up. Check the terminal for any errors." -ForegroundColor Yellow
    Write-Host "   If there are issues, try running 'npm run dev' manually." -ForegroundColor Gray
}

Write-Host ""
Write-Host "💡 Useful commands:" -ForegroundColor Cyan
Write-Host "   npm run backup        - Create backup of current App.tsx" -ForegroundColor Gray
Write-Host "   npm run restore-backup - Restore from working backup" -ForegroundColor Gray
Write-Host "   npm run lint:fix       - Fix linting issues automatically" -ForegroundColor Gray
Write-Host "   npm run type-check     - Check TypeScript without building" -ForegroundColor Gray
