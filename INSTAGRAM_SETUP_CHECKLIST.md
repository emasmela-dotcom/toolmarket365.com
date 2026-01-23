# Instagram Scheduler Setup Checklist

Use this checklist to ensure your Instagram Scheduler is fully configured and working.

## ✅ Prerequisites

- [ ] Vercel account (free tier works)
- [ ] Facebook Developer account (free)
- [ ] Instagram account (personal or business)
- [ ] Domain name (for production) or localhost (for development)

---

## 📋 Step 1: Facebook Developer App Setup

### Create Facebook App
- [ ] Go to [Facebook Developers](https://developers.facebook.com/)
- [ ] Click **"My Apps"** → **"Create App"**
- [ ] Choose **"Business"** as app type
- [ ] Enter app name: `CreatorFlow365` (or your choice)
- [ ] Enter contact email
- [ ] Click **"Create App"**

### Add Instagram Product
- [ ] In app dashboard, click **"Add Product"**
- [ ] Find **"Instagram Basic Display"**
- [ ] Click **"Set Up"**
- [ ] Complete setup wizard

### Configure OAuth Redirect URI
- [ ] Go to **Settings** → **Basic**
- [ ] Scroll to **"Valid OAuth Redirect URIs"**
- [ ] Add your redirect URI:
  - Development: `http://localhost:3000/api/instagram/auth/callback`
  - Production: `https://your-domain.com/api/instagram/auth/callback`
- [ ] Click **"Save Changes"**

### Get Credentials
- [ ] Go to **Settings** → **Basic**
- [ ] Copy **App ID** → Save as `INSTAGRAM_APP_ID`
- [ ] Copy **App Secret** → Save as `INSTAGRAM_APP_SECRET`
- [ ] Note your **Redirect URI** (must match exactly)

---

## 📋 Step 2: Environment Variables

### Local Development (.env.local)
- [ ] Create `.env.local` file in project root
- [ ] Add Instagram credentials:
  ```bash
  INSTAGRAM_APP_ID=your-app-id-here
  INSTAGRAM_APP_SECRET=your-app-secret-here
  INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/auth/callback
  NEXT_PUBLIC_INSTAGRAM_APP_ID=your-app-id-here
  ```
- [ ] Generate and add CRON_SECRET:
  ```bash
  CRON_SECRET=your-secure-random-string-here
  ```
  Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Vercel Production
- [ ] Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- [ ] Add all environment variables from `.env.local`
- [ ] Update `INSTAGRAM_REDIRECT_URI` to production domain
- [ ] Update `NEXT_PUBLIC_INSTAGRAM_APP_ID` to production App ID
- [ ] Ensure `CRON_SECRET` matches between local and production

---

## 📋 Step 3: Vercel Cron Job Setup

### Configure vercel.json
- [ ] Open `vercel.json` in project root
- [ ] Verify cron job configuration exists:
  ```json
  {
    "crons": [{
      "path": "/api/instagram/schedule",
      "schedule": "0 * * * *"
    }]
  }
  ```
- [ ] If missing, add it

### Deploy to Vercel
- [ ] Commit and push changes to Git
- [ ] Deploy to Vercel (automatic if connected to Git)
- [ ] Verify deployment succeeded

### Verify Cron Job
- [ ] Go to Vercel Dashboard → Your Project → Settings → Cron Jobs
- [ ] Verify cron job is listed: `/api/instagram/schedule`
- [ ] Check schedule: `0 * * * *` (runs hourly)
- [ ] Note: Free tier runs hourly (posts checked within 1-hour window)

---

## 📋 Step 4: Database Setup

### Run SQL Schema
- [ ] Connect to your Neon database
- [ ] Run all SQL from `lib/schema.sql` related to Instagram:
  - `instagram_accounts` table
  - `instagram_posts` table
  - `instagram_media` table
  - `instagram_hashtags` table
  - `instagram_analytics` table
  - `instagram_schedules` table
  - All indexes and triggers
- [ ] Verify tables created successfully

---

## 📋 Step 5: Test Connection

### Connect Instagram Account
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to `/tools/instagram-scheduler/accounts`
- [ ] Click **"Connect Instagram Account"**
- [ ] Complete Instagram OAuth authorization
- [ ] Verify redirect back to app
- [ ] Check for success message
- [ ] Verify account appears in dashboard

### Test Post Creation
- [ ] Navigate to `/tools/instagram-scheduler/create`
- [ ] Select connected Instagram account
- [ ] Fill in post details:
  - [ ] Post type (feed/story/reel/igtv)
  - [ ] Content/caption
  - [ ] Hashtags
  - [ ] Mentions (optional)
  - [ ] Schedule date/time
- [ ] Click **"Schedule Post"**
- [ ] Verify success message
- [ ] Check post appears in dashboard

### Test Scheduling
- [ ] Create a test post scheduled for 1 hour from now
- [ ] Wait for cron job to run (next hour mark)
- [ ] Check post status changed to "published"
- [ ] Verify post appears on Instagram
- [ ] Check engagement data is captured

---

## 📋 Step 6: Production Checklist

### Facebook App Review (Optional)
- [ ] For production use, submit app for review
- [ ] Development mode works with your own account only
- [ ] Production requires app review for other users

### Security
- [ ] Ensure `CRON_SECRET` is strong and unique
- [ ] Verify HTTPS is enabled (required for OAuth)
- [ ] Check environment variables are not exposed in code
- [ ] Review API rate limits and implement throttling if needed

### Monitoring
- [ ] Set up error logging for failed posts
- [ ] Monitor cron job execution in Vercel dashboard
- [ ] Track API usage in Facebook Developer dashboard
- [ ] Set up alerts for failed posts

---

## 🐛 Troubleshooting

### Connection Issues
- [ ] **"Invalid redirect URI"**: Check redirect URI matches exactly in Facebook App settings
- [ ] **"App not approved"**: Development mode only works with your own account
- [ ] **"Access token expired"**: Tokens expire after 60 days, implement refresh logic

### Posting Issues
- [ ] **Posts not publishing**: 
  - Check cron job is configured in `vercel.json`
  - Verify `CRON_SECRET` matches in environment variables
  - Check cron job is running in Vercel dashboard
  - Review server logs for errors
- [ ] **"Failed" status**: 
  - Check Instagram API credentials are valid
  - Verify account access token hasn't expired
  - Check media file sizes are within limits
  - Review error logs for specific issues

### Cron Job Issues
- [ ] **Cron not running**: 
  - Verify `vercel.json` has correct cron configuration
  - Check Vercel project is deployed
  - Ensure path `/api/instagram/schedule` exists
  - Verify `CRON_SECRET` is set
- [ ] **Posts published late**: 
  - Free tier runs hourly (posts checked within 1-hour window)
  - Upgrade to Pro for more frequent checks

---

## ✅ Completion Checklist

- [ ] Facebook Developer App created and configured
- [ ] Instagram Basic Display product added
- [ ] OAuth redirect URI configured
- [ ] Environment variables set (local and production)
- [ ] Vercel cron job configured and deployed
- [ ] Database tables created
- [ ] Instagram account connected successfully
- [ ] Test post created and scheduled
- [ ] Post published successfully via cron job
- [ ] Engagement data captured
- [ ] All error handling working
- [ ] Production domain configured (if applicable)

---

## 📚 Additional Resources

- [Instagram API Setup Guide](./INSTAGRAM_API_SETUP.md) - Detailed API setup
- [Vercel Cron Setup Guide](./VERCEL_CRON_SETUP.md) - Cron job configuration
- [Instagram Scheduler README](./app/tools/instagram-scheduler/README.md) - Feature documentation

---

**Need Help?** Check the troubleshooting section or review the detailed setup guides linked above.
