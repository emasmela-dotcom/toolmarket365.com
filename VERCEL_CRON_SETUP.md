# Vercel Cron Job Setup

## Overview
To automatically publish scheduled Instagram posts, you need to set up a Vercel Cron Job that runs every 5 minutes.

## Step 1: Add Cron Configuration to vercel.json

The cron job configuration is already added to `vercel.json`. It will:
- Run every hour (free tier limitation - Pro plan allows per-minute)
- Call `/api/instagram/schedule`
- Use `CRON_SECRET` for security

**Note:** On Vercel's free Hobby plan, cron jobs run hourly. For per-minute scheduling, upgrade to Pro plan ($20/month).

## Step 2: Set Environment Variable

Add to your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key:** `CRON_SECRET`
   - **Value:** (same secure random string from Instagram setup)
   - **Environment:** Production, Preview, Development (all)

## Step 3: Deploy to Vercel

After adding the environment variable:

```bash
git add .
git commit -m "Add Instagram scheduler cron job"
git push origin main
```

Vercel will automatically deploy and enable the cron job.

## Step 4: Verify Cron Job

1. Go to Vercel Dashboard → Your Project → **Cron Jobs** tab
2. You should see:
    - **Name:** `instagram-scheduler`
    - **Schedule:** `0 * * * *` (every hour - free tier)
    - **Endpoint:** `/api/instagram/schedule`
    - **Status:** Active

## Step 5: Test Cron Job

**Manual Test:**
```bash
curl -X GET "https://your-domain.com/api/instagram/schedule" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected Response:**
```json
{
  "success": true,
  "processed": 0,
  "results": []
}
```

## How It Works

1. **Every hour** (on free tier), Vercel calls `/api/instagram/schedule`
2. The endpoint checks for posts where:
   - `status = 'scheduled'`
   - `scheduled_for` is within the last hour to next hour
3. For each due post:
   - Posts to Instagram via API
   - Updates status to `'published'` or `'failed'`
   - Records Instagram post ID and permalink

## Monitoring

**Check Cron Job Logs:**
- Vercel Dashboard → Your Project → **Functions** → `/api/instagram/schedule`
- View execution logs and errors

**Check Post Status:**
- Go to `/tools/instagram-scheduler`
- View posts with status: `scheduled`, `published`, or `failed`

## Troubleshooting

**Cron job not running:**
- Verify `CRON_SECRET` is set in Vercel environment variables
- Check Vercel Cron Jobs tab shows the job as "Active"
- Ensure the route `/api/instagram/schedule` exists and is deployed

**Posts not publishing:**
- Check cron job logs for errors
- Verify Instagram API credentials are set
- Check post `scheduled_for` times are in the future
- Verify access tokens haven't expired

**"Unauthorized" errors:**
- Ensure `CRON_SECRET` in Vercel matches the one in your code
- Check the Authorization header format: `Bearer YOUR_CRON_SECRET`

## Alternative: Manual Trigger

For testing, you can manually trigger the cron job:

```bash
# Using curl
curl -X GET "http://localhost:3000/api/instagram/schedule" \
  -H "Authorization: Bearer your-cron-secret-here"
```

Or create a test button in your dashboard (for development only).
