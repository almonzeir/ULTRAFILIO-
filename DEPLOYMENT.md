# 🚀 Deploying UltraFolio to Production

This guide covers deployment to various platforms.

---

## Prerequisites

Before deploying, ensure you have:

- [x] All environment variables configured
- [x] Firebase project set up
- [x] Firebase security rules deployed
- [x] Production build tested locally
- [x] Custom domain (optional)

---

## Option 1: Vercel (Recommended - Easiest)

### Why Vercel?
- ✅ Built for Next.js
- ✅ Automatic deployments from Git
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Generous free tier

### Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   - Go to your project dashboard on vercel.com
   - Settings → Environment Variables
   - Add all variables from your `.env.local`:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `GOOGLE_API_KEY`
     - `FIREBASE_SERVICE_ACCOUNT_KEY`
     - `NEXT_PUBLIC_APP_URL` (your production URL)

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

6. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

---

## Option 2: Firebase Hosting

### Why Firebase Hosting?
- ✅ Integrated with Firebase services
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Easy rollbacks

### Deployment Steps

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   
   Select:
   - Use existing project
   - Public directory: `out`
   - Configure as single-page app: Yes
   - Set up automatic builds: No

4. **Update package.json**
   Add export script:
   ```json
   "scripts": {
     "export": "next build && next export"
   }
   ```

5. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

6. **Set Environment Variables**
   
   For Firebase Functions (if using):
   ```bash
   firebase functions:config:set \
     google.api_key="YOUR_KEY" \
     firebase.service_account="YOUR_SERVICE_ACCOUNT_JSON"
   ```

---

## Option 3: Netlify

### Why Netlify?
- ✅ Easy Git integration
- ✅ Free SSL certificates
- ✅ Form handling
- ✅ Serverless functions

### Deployment Steps

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize**
   ```bash
   netlify init
   ```

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

5. **Add Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add all environment variables

6. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## Post-Deployment Checklist

### 1. Deploy Firebase Security Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

### 2. Test Production Site

- [ ] Homepage loads correctly
- [ ] Sign up/login works
- [ ] CV upload works
- [ ] AI parsing works
- [ ] Portfolio generation works
- [ ] All templates display correctly
- [ ] Dark mode works
- [ ] Mobile responsive

### 3. Configure Custom Domain

Follow your platform's guide:
- [Vercel Domains](https://vercel.com/docs/concepts/projects/domains)
- [Firebase Domains](https://firebase.google.com/docs/hosting/custom-domain)
- [Netlify Domains](https://docs.netlify.com/domains-https/custom-domains/)

### 4. Set Up Monitoring (Optional but Recommended)

**Sentry for Error Tracking:**

1. Create account at [sentry.io](https://sentry.io)
2. Install Sentry:
   ```bash
   npm install @sentry/nextjs
   ```
3. Initialize:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
4. Add DSN to environment variables

**Google Analytics:**

1. Create GA4 property
2. Add tracking code to `layout.tsx`:
   ```tsx
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
     strategy="afterInteractive"
   />
   ```

### 5. Enable HTTPS

All platforms provide free SSL certificates automatically. Ensure:
- [ ] HTTPS is enabled
- [ ] HTTP redirects to HTTPS
- [ ] Mixed content warnings resolved

### 6. Performance Optimization

Run these checks:
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] [GTmetrix](https://gtmetrix.com/)
- [ ] [WebPageTest](https://www.webpagetest.org/)

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## Continuous Deployment

### GitHub Actions (for Vercel)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Rollback Strategy

### Vercel
```bash
vercel rollback
```

### Firebase
```bash
firebase hosting:rollback
```

### Netlify
Use the Netlify dashboard to select a previous deployment.

---

## Environment-Specific Configuration

### Production `.env.production`

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
# Add other production-specific variables
```

### Staging `.env.staging`

```env
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
# Use separate Firebase project for staging
```

---

## Troubleshooting

### Build Fails

**Issue:** TypeScript errors
```bash
npm run typecheck
# Fix all errors before deploying
```

**Issue:** Missing environment variables
- Check all variables are set in platform dashboard
- Verify no typos in variable names

### Runtime Errors

**Issue:** Firebase not connecting
- Verify Firebase config in environment variables
- Check Firebase project is active
- Ensure billing is enabled for Storage

**Issue:** AI parsing fails
- Verify `GOOGLE_API_KEY` is correct
- Check API quota at Google AI Studio
- Ensure API is enabled for your project

### Performance Issues

**Issue:** Slow page loads
- Enable CDN caching
- Optimize images (use Next.js Image component)
- Enable compression in `next.config.mjs`

---

## Security Best Practices

1. **Never commit `.env.local`** to Git
2. **Use environment variables** for all secrets
3. **Enable Firebase security rules** before going live
4. **Set up rate limiting** (already configured in middleware)
5. **Monitor for suspicious activity**
6. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

---

## Monitoring & Maintenance

### Weekly Tasks
- [ ] Check error logs
- [ ] Review analytics
- [ ] Monitor API usage
- [ ] Check Firebase quotas

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review security rules
- [ ] Backup Firestore data
- [ ] Performance audit

---

## Support & Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

---

**Ready to deploy? Start with Vercel - it's the easiest!** 🚀
