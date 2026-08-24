Write-Host "Kalan Node.js islemleri sonlandiriliyor..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host ".next klasoru temizleniyor..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
}

Write-Host "Sunucu baslatiliyor..." -ForegroundColor Green
npm run dev
