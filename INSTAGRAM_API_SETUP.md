# Instagram API Setup Guide

## Overview
To enable automatic posting to Instagram, you need to set up Facebook Developer credentials and configure Instagram API access.

## Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** as the app type
4. Fill in:
   - **App Name:** CreatorFlow365 (or your preferred name)
   - **App Contact Email:** Your email
   - Click **"Create App"**

## Step 2: Add Instagram Basic Display Product

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. Follow the setup wizard

## Step 3: Configure Instagram Basic Display

1. Go to **Settings** → **Basic**
2. Add **Valid OAuth Redirect URIs:**
   ```
   http://localhost:3000/api/instagram/auth/callback
   https://your-domain.com/api/instagram/auth/callback
   ```
3. Save changes

## Step 4: Get Your Credentials

1. Go to **Settings** → **Basic**
2. Copy:
   - **App ID** → This is your `INSTAGRAM_APP_ID`
   - **App Secret** → This is your `INSTAGRAM_APP_SECRET`
3. Go to **Products** → **Instagram Basic Display** → **Basic Display**
4. Note your **Redirect URI** (should match what you set above)

## Step 5: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Instagram API Configuration
INSTAGRAM_APP_ID=your-app-id-here
INSTAGRAM_APP_SECRET=your-app-secret-here
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/auth/callback

# Cron Job Security (for scheduled posting)
CRON_SECRET=your-secure-random-string-here
```

**Generate CRON_SECRET:**
```bash
# Run this in terminal to generate a secure random string:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Create OAuth Callback Route

The Instagram OAuth callback route needs to be created at:
`/app/api/instagram/auth/callback/route.ts`

This will handle the OAuth flow when users connect their Instagram accounts.

## Step 7: Test Connection

1. Start your dev server: `npm run dev`
2. Go to `/tools/instagram-scheduler`
3. Click **"Connect Account"**
4. Complete the OAuth flow

## Important Notes

⚠️ **Instagram API Limitations:**
- Instagram Basic Display API has rate limits
- Some features require Instagram Business Account
- Reels posting requires Instagram Graph API (more complex setup)
- Stories posting has additional requirements

⚠️ **Production Setup:**
- Update `INSTAGRAM_REDIRECT_URI` to your production domain
- Add production domain to Facebook App settings
- Ensure HTTPS is enabled (required for OAuth)

## Troubleshooting

**"Invalid redirect URI" error:**
- Check that your redirect URI in `.env.local` matches exactly what's in Facebook App settings
- Ensure no trailing slashes

**"App not approved" error:**
- Instagram Basic Display requires app review for production use
- Development mode works with your own Instagram account only

**"Access token expired":**
- Tokens expire after 60 days
- Implement token refresh logic (see Instagram API docs)

## Next Steps

After setup:
1. ✅ Test account connection
2. ✅ Test post scheduling
3. ✅ Set up cron job (see `VERCEL_CRON_SETUP.md`)
4. ✅ Monitor API usage and rate limits
