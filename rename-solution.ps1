# ============================================
# Solution Rename Script
# From: SamElhagPersonalSite → SamElhag.Dev
# ============================================

Write-Host "🔄 Starting solution rename process..." -ForegroundColor Cyan
Write-Host ""

$oldName = "SamElhagPersonalSite"
$newName = "SamElhag.Dev"
$rootPath = Get-Location

# Stop if Visual Studio is still running
Write-Host "⚠️  Please ensure Visual Studio is CLOSED before continuing!" -ForegroundColor Yellow
$confirm = Read-Host "Press ENTER to continue or Ctrl+C to cancel"

Write-Host ""
Write-Host "📦 Step 1: Renaming project directories..." -ForegroundColor Green

# Rename directories
if (Test-Path "$oldName") {
    Rename-Item -Path "$oldName" -NewName "$newName"
    Write-Host "  ✅ Renamed: $oldName → $newName"
}

if (Test-Path "$oldName.ServiceDefaults") {
    Rename-Item -Path "$oldName.ServiceDefaults" -NewName "$newName.ServiceDefaults"
    Write-Host "  ✅ Renamed: $oldName.ServiceDefaults → $newName.ServiceDefaults"
}

if (Test-Path "$oldName.AppHost") {
    Rename-Item -Path "$oldName.AppHost" -NewName "$newName.AppHost"
    Write-Host "  ✅ Renamed: $oldName.AppHost → $newName.AppHost"
}

Write-Host ""
Write-Host "📄 Step 2: Renaming project files..." -ForegroundColor Green

# Rename .csproj files
if (Test-Path "$newName\$oldName.csproj") {
    Rename-Item -Path "$newName\$oldName.csproj" -NewName "$newName.csproj"
    Write-Host "  ✅ Renamed: $oldName.csproj → $newName.csproj"
}

if (Test-Path "$newName.ServiceDefaults\$oldName.ServiceDefaults.csproj") {
    Rename-Item -Path "$newName.ServiceDefaults\$oldName.ServiceDefaults.csproj" -NewName "$newName.ServiceDefaults.csproj"
    Write-Host "  ✅ Renamed: $oldName.ServiceDefaults.csproj → $newName.ServiceDefaults.csproj"
}

if (Test-Path "$newName.AppHost\$oldName.AppHost.csproj") {
    Rename-Item -Path "$newName.AppHost\$oldName.AppHost.csproj" -NewName "$newName.AppHost.csproj"
    Write-Host "  ✅ Renamed: $oldName.AppHost.csproj → $newName.AppHost.csproj"
}

Write-Host ""
Write-Host "🔍 Step 3: Finding solution file..." -ForegroundColor Green

# Find and rename solution file
$slnFiles = Get-ChildItem -Path . -Filter "*.sln" -File
if ($slnFiles.Count -gt 0) {
    $slnFile = $slnFiles[0]
    $newSlnName = "$newName.sln"
    
    # Update solution file content
    $slnContent = Get-Content $slnFile.FullName -Raw
    $slnContent = $slnContent -replace [regex]::Escape($oldName), $newName
    Set-Content -Path $slnFile.FullName -Value $slnContent
    Write-Host "  ✅ Updated solution file content"
    
    # Rename solution file
    if ($slnFile.Name -ne $newSlnName) {
        Rename-Item -Path $slnFile.FullName -NewName $newSlnName
        Write-Host "  ✅ Renamed: $($slnFile.Name) → $newSlnName"
    }
} else {
    Write-Host "  ⚠️  No solution file found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Step 4: Updating namespace references..." -ForegroundColor Green

# Update all C# files with namespace changes
$csFiles = Get-ChildItem -Path . -Recurse -Filter "*.cs" -File | Where-Object { $_.FullName -notmatch '\\obj\\|\\bin\\' }
$updateCount = 0

foreach ($file in $csFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match [regex]::Escape($oldName)) {
        $content = $content -replace [regex]::Escape($oldName), $newName
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updateCount++
    }
}
Write-Host "  ✅ Updated $updateCount C# files"

Write-Host ""
Write-Host "🎨 Step 5: Updating Razor files..." -ForegroundColor Green

# Update all Razor files
$razorFiles = Get-ChildItem -Path . -Recurse -Filter "*.razor" -File | Where-Object { $_.FullName -notmatch '\\obj\\|\\bin\\' }
$updateCount = 0

foreach ($file in $razorFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match [regex]::Escape($oldName)) {
        $content = $content -replace [regex]::Escape($oldName), $newName
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updateCount++
    }
}
Write-Host "  ✅ Updated $updateCount Razor files"

Write-Host ""
Write-Host "⚙️  Step 6: Updating project files..." -ForegroundColor Green

# Update all .csproj files
$csprojFiles = Get-ChildItem -Path . -Recurse -Filter "*.csproj" -File | Where-Object { $_.FullName -notmatch '\\obj\\|\\bin\\' }
$updateCount = 0

foreach ($file in $csprojFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match [regex]::Escape($oldName)) {
        $content = $content -replace [regex]::Escape($oldName), $newName
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updateCount++
    }
}
Write-Host "  ✅ Updated $updateCount project files"

Write-Host ""
Write-Host "📋 Step 7: Updating JSON files..." -ForegroundColor Green

# Update launchSettings.json, appsettings.json, etc.
$jsonFiles = Get-ChildItem -Path . -Recurse -Filter "*.json" -File | Where-Object { $_.FullName -notmatch '\\obj\\|\\bin\\' }
$updateCount = 0

foreach ($file in $jsonFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match [regex]::Escape($oldName)) {
        $content = $content -replace [regex]::Escape($oldName), $newName
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updateCount++
    }
}
Write-Host "  ✅ Updated $updateCount JSON files"

Write-Host ""
Write-Host "🧹 Step 8: Cleaning build artifacts..." -ForegroundColor Green

# Delete bin and obj folders
Get-ChildItem -Path . -Recurse -Directory -Include "bin","obj" | Remove-Item -Recurse -Force
Write-Host "  ✅ Cleaned bin and obj folders"

Write-Host ""
Write-Host "✅ Rename complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open the new solution: $newName.sln"
Write-Host "  2. Rebuild the solution (Ctrl+Shift+B)"
Write-Host "  3. Verify everything compiles"
Write-Host "  4. Update your Git remote if needed"
Write-Host "  5. Test your application"
Write-Host ""
