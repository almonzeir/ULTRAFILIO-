# 🚀 UltraFolio - Quick Start Guide

Get your UltraFolio production-ready in **3 hours** with this easy step-by-step guide!

---

## 📋 Phase 1: Critical Setup (30 minutes)

### Step 1: Install Dependencies

```bash
cd M:\ULTRAFOLIO\Ultrafilio
npm install
```

This will install all required packages including the new Windows-compatible build tools.

### Step 2: Set Up Environment Variables

**Option A: Automated Setup (Recommended)**

```bash
npm run setup
```

Follow the interactive prompts to create your `.env.local` file.

**Option B: Manual Setup**

1. Copy `.env.local.example` to `.env.local`
2. Open `.env.local` in your editor
3. Fill in your credentials (see below)

#### 🔑 Getting Your Credentials

**Firebase Configuration:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select/create your project
3. Click ⚙️ > Project Settings > General
4. Scroll to "Your apps" > Web app
5. Copy the config values to `.env.local`

**Google AI API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy to `.env.local` as `GOOGLE_API_KEY`

**Firebase Service Account:**
1. Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download JSON file
4. Copy entire JSON content as single line to `FIREBASE_SERVICE_ACCOUNT_KEY`

### Step 3: Enable Firebase Services

1. **Firestore Database:**
   - Firebase Console > Build > Firestore Database
   - Click "Create database"
   - Start in **test mode** (we'll add security rules later)
   - Choose your region

2. **Firebase Storage:**
   - Firebase Console > Build > Storage
   - Click "Get started"
   - Start in **test mode**
   - Use default bucket

3. **Authentication:**
   - Firebase Console > Build > Authentication
   - Click "Get started"
   - Enable "Email/Password" sign-in method

### Step 4: Test Local Development

```bash
npm run dev
```

Open [http://localhost:9003](http://localhost:9003) in your browser.

✅ **Success Check:** You should see the UltraFolio landing page!

---

## 🛠️ Phase 2: Essential Fixes (1 hour)

### Step 5: Fix TypeScript Configuration

```bash
# Run type checking to see current errors
npm run typecheck
```

I'll help you fix any TypeScript errors that appear.

### Step 6: Add Error Boundaries

Error boundaries catch React errors and show user-friendly messages instead of blank screens.

### Step 7: Add SEO Metadata

Improve your site's discoverability with proper meta tags.

### Step 8: Test Core Features

1. **Sign Up:** Create a new account
2. **Upload CV:** Test with a PDF resume
3. **Generate Portfolio:** Verify AI parsing works
4. **Choose Template:** Test different templates
5. **View Portfolio:** Check the final result

---

## 🔒 Phase 3: Production Ready (1 hour)

### Step 9: Add Firebase Security Rules

**Firestore Rules** (`firestore.rules`):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Portfolios - users can only read/write their own
    match /portfolios/{portfolioId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Deploy Rules:**
```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy security rules
firebase deploy --only firestore:rules,storage:rules
```

### Step 10: Build for Production

```bash
npm run build
```

✅ **Success Check:** Build completes without errors!

### Step 11: Test Production Build

```bash
npm run start:prod
```

Test all features again in production mode.

---

## 🎨 Phase 4: Polish & Deploy (30 minutes)

### Step 12: Choose Deployment Platform

**Option A: Vercel (Recommended - Easiest)**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow prompts to link your project

4. Add environment variables in Vercel dashboard

**Option B: Firebase Hosting**

1. Initialize hosting:
   ```bash
   firebase init hosting
   ```

2. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

**Option C: Netlify**

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Step 13: Configure Custom Domain (Optional)

Follow your platform's guide:
- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Firebase Custom Domains](https://firebase.google.com/docs/hosting/custom-domain)
- [Netlify Custom Domains](https://docs.netlify.com/domains-https/custom-domains/)

### Step 14: Set Up Monitoring

Add basic error tracking:

1. Create free account at [Sentry.io](https://sentry.io)
2. Get your DSN
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

---

## ✅ Final Checklist

Before going live, verify:

- [ ] All environment variables are set
- [ ] Firebase services are enabled
- [ ] Security rules are deployed
- [ ] Production build works locally
- [ ] All core features tested
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic on Vercel/Netlify)
- [ ] Error monitoring set up

---

## 🎉 You're Live!

Congratulations! Your UltraFolio is now production-ready!

### Next Steps:

1. **Share it:** Post on social media, LinkedIn, Twitter
2. **Get feedback:** Share with friends and collect testimonials
3. **Iterate:** Add features based on user feedback
4. **Monitor:** Check error logs and analytics regularly

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

### Firebase Connection Issues

- Verify all environment variables are correct
- Check Firebase project is active
- Ensure billing is enabled (for Storage)

### AI Parsing Not Working

- Verify `GOOGLE_API_KEY` is correct
- Check API quota at [Google AI Studio](https://aistudio.google.com/)
- Ensure CV file is under 15MB

### Need Help?

Create an issue with:
- Error message
- Steps to reproduce
- Your environment (Node version, OS)

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built with ❤️ by you!**
