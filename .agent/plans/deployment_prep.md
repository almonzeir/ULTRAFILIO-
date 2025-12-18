# Deployment Preparation Plan

## 1. Environment Variables Verification
- [x] Gather all required environment variables.
- [x] Correctly configure Lemon Squeezy IDs in code/env.
- [x] Update `NEXT_PUBLIC_APP_URL` logic.

## 2. Deployment
- [ ] Push code to GitHub.
- [ ] Connect Vercel to GitHub repository.
- [ ] Add Environment Variables in Vercel.
- [ ] Deploy.

## 3. Post-Deployment Configuration
- [ ] Copy Vercel Production URL.
- [ ] Update Lemon Squeezy Webhook URL (`/api/webhooks/lemonsqueezy`).
- [ ] Add `LEMONSQUEEZY_WEBHOOK_SECRET` to Vercel Env Vars.
- [ ] Redeploy (if necessary) or just verify.
