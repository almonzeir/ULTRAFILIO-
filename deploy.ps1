# Quick Deployment Script for UltraFolio
# Run this to deploy to Vercel

Write-Host "🚀 UltraFolio Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ Error: Must run from project root directory!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project found!" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "📦 Checking for Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-Not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
}
else {
    Write-Host "✅ Vercel CLI already installed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔨 Building project locally first..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  IMPORTANT REMINDERS:" -ForegroundColor Yellow
    Write-Host "  1. You'll need to login to Vercel" -ForegroundColor White
    Write-Host "  2. Add environment variables in Vercel dashboard after deploy" -ForegroundColor White
    Write-Host "  3. Update Supabase allowed origins with your new URL" -ForegroundColor White
    Write-Host ""
    
    vercel --prod
    
    Write-Host ""
    Write-Host "🎉 Deployment complete!" -ForegroundColor Green
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Copy the deployment URL" -ForegroundColor White
    Write-Host "  2. Go to https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "  3. Click your project → Settings → Environment Variables" -ForegroundColor White
    Write-Host "  4. Add your .env variables there" -ForegroundColor White
    Write-Host "  5. Go to Supabase → Settings → API → Add your URL to Allowed Origins" -ForegroundColor White
    Write-Host ""
}
else {
    Write-Host "❌ Build failed! Please fix errors and try again." -ForegroundColor Red
    Write-Host "   Check the output above for error details." -ForegroundColor Yellow
}
