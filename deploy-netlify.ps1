# Deploy to Netlify Script

Write-Host "🚀 UltraFolio Deployment (Netlify)" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check for Netlify CLI
$netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue

if (-Not $netlifyInstalled) {
    Write-Host "📦 Netlify CLI not found. Installing global CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
    
    if (-Not $?) {
        Write-Host "❌ Failed to install Netlify CLI. Please run: npm install -g netlify-cli" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "✅ Netlify CLI found!" -ForegroundColor Green
}

# Build
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix errors first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Deploy
Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Cyan
Write-Host "   (You may need to login browser)" -ForegroundColor White
Write-Host ""

netlify deploy --prod

Write-Host ""
Write-Host "⚠️  REMINDERS:" -ForegroundColor Yellow
Write-Host "1. Add Environment Variables in Netlify Dashboard (Site Settings -> Build & Deploy -> Environment):" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host "   - GOOGLE_GENERATIVE_AI_API_KEY" -ForegroundColor White
Write-Host "   - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Done!" -ForegroundColor Green
