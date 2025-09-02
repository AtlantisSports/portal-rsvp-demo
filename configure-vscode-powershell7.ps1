# PowerShell 7 - VS Code Configuration Helper
# Run this script to configure VS Code to use PowerShell 7 globally

Write-Host "🔧 Configuring VS Code to use PowerShell 7 globally..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if PowerShell 7 is available
try {
    $pwshVersion = & pwsh -c '$PSVersionTable.PSVersion' 2>$null
    Write-Host "✅ PowerShell 7 found: $pwshVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PowerShell 7 not found. Please install it first." -ForegroundColor Red
    exit 1
}

# Get VS Code settings path
$settingsPath = "$env:APPDATA\Code\User\settings.json"
Write-Host "📁 VS Code settings path: $settingsPath" -ForegroundColor Yellow

# Create the configuration JSON
$config = @{
    "terminal.integrated.defaultProfile.windows" = "PowerShell 7"
    "terminal.integrated.profiles.windows" = @{
        "PowerShell 7" = @{
            "path" = "pwsh.exe"
            "args" = @()
            "icon" = "terminal-powershell"
            "overrideName" = $true
        }
        "Windows PowerShell" = @{
            "path" = "powershell.exe" 
            "args" = @()
            "icon" = "terminal-powershell"
        }
    }
}

Write-Host "📋 Configuration to add to VS Code settings:" -ForegroundColor Cyan
Write-Host ($config | ConvertTo-Json -Depth 10) -ForegroundColor Gray

Write-Host ""
Write-Host "🎯 Manual Steps:" -ForegroundColor Yellow
Write-Host "1. Press Ctrl+Shift+P in VS Code" -ForegroundColor White
Write-Host "2. Type: 'Preferences: Open User Settings (JSON)'" -ForegroundColor White  
Write-Host "3. Add the configuration shown above" -ForegroundColor White
Write-Host "4. Save the file" -ForegroundColor White
Write-Host "5. Restart VS Code" -ForegroundColor White
Write-Host ""
Write-Host "🔄 After restart, new terminals will use PowerShell 7!" -ForegroundColor Green
