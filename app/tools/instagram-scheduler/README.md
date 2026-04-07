# Instagram Planning & Scheduling Tool

## Overview
The Instagram Planning & Scheduling Tool allows content creators to plan, schedule, and automatically publish Instagram posts. Schedule your content in advance and let the system handle publishing at the optimal times.

## Features
- **Account Management**: Connect multiple Instagram accounts
- **Post Scheduling**: Schedule posts for future dates and times
- **Media Support**: Upload images and videos for your posts
- **Hashtag Management**: Add and organize hashtags
- **Post Types**: Support for Feed, Story, Reel, and IGTV posts
- **Analytics**: Track engagement and performance metrics
- **Auto-Publishing**: Automatic posting via cron job (requires setup)

## Getting Started

### 1. Connect Instagram Account
1. Navigate to `/tools/instagram-scheduler/accounts`
2. Click "Connect Instagram Account"
3. Authorize the app through Instagram OAuth
4. Your account will be connected automatically

### 2. Create a Scheduled Post
1. Go to `/tools/instagram-scheduler/create`
2. Select your Instagram account
3. Choose post type (Feed, Story, Reel, or IGTV)
4. Upload media (images/videos)
5. Write your caption and add hashtags
6. Set the date and time for publishing
7. Click "Schedule Post"

### 3. View Scheduled Posts
- View all scheduled posts on the main dashboard (`/tools/instagram-scheduler`)
- See post status: Draft, Scheduled, Published, or Failed
- Edit or cancel scheduled posts before they publish

## Setup Requirements

### Instagram API Setup (Required for Publishing)
To enable automatic posting, you need to set up Instagram API credentials:

1. **Create Facebook App**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add Instagram Basic Display product

2. **Get Credentials**
   - App ID
   - App Secret
   - Configure OAuth redirect URI: `https://yourdomain.com/api/instagram/auth/callback`

3. **Set Environment Variables**
   ```
   INSTAGRAM_APP_ID=your_app_id
   INSTAGRAM_APP_SECRET=your_app_secret
   NEXT_PUBLIC_INSTAGRAM_APP_ID=your_app_id
   INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/instagram/auth/callback
   ```

See `INSTAGRAM_API_SETUP.md` for detailed instructions.

### Cron Job Setup (Required for Auto-Publishing)
The system uses a Vercel cron job to check for and publish scheduled posts:

1. **Configure in `vercel.json`**
   ```json
   {
     "crons": [{
       "path": "/api/instagram/schedule",
       "schedule": "0 * * * *"
     }]
   }
   ```

2. **Set Environment Variable**
   ```
   CRON_SECRET=your_secret_key
   ```

3. **Deploy to Vercel**
   - The cron job runs hourly on the free tier
   - Posts are checked and published within a 1-hour window

See `VERCEL_CRON_SETUP.md` for detailed instructions.

## Post Statuses
- **Draft**: Post is saved but not scheduled
- **Scheduled**: Post is scheduled for future publishing
- **Published**: Post has been successfully published to Instagram
- **Failed**: Post failed to publish (check logs for errors)
- **Cancelled**: Post was cancelled before publishing

## API Endpoints

### Accounts
- `GET /api/instagram/accounts` - List connected accounts
- `POST /api/instagram/accounts` - Add new account
- `GET /api/instagram/auth/callback` - OAuth callback handler

### Posts
- `GET /api/instagram/posts` - List posts (with filters)
- `POST /api/instagram/posts` - Create new post
- `GET /api/instagram/posts/[id]` - Get specific post
- `PUT /api/instagram/posts/[id]` - Update post
- `DELETE /api/instagram/posts/[id]` - Delete post

### Scheduling
- `GET /api/instagram/schedule` - Cron endpoint (checks and publishes due posts)

## Database Schema
The system uses several tables:
- `instagram_accounts`: Connected Instagram accounts
- `instagram_posts`: Scheduled and published posts
- `instagram_media`: Media files associated with posts
- `instagram_hashtags`: Hashtag tracking
- `instagram_analytics`: Performance metrics
- `instagram_schedules`: Schedule metadata

## Limitations
- **Free Tier**: Cron jobs run hourly (posts checked within 1-hour window)
- **API Rate Limits**: Instagram API has rate limits (check Instagram documentation)
- **Media Size**: Instagram has file size limits (images: 8MB, videos: 100MB)
- **Business Accounts**: Some features require Instagram Business accounts

## Troubleshooting

### Posts Not Publishing
1. Check cron job is configured correctly
2. Verify `CRON_SECRET` environment variable matches
3. Check Instagram API credentials are valid
4. Review server logs for errors
5. Ensure account access token hasn't expired

### OAuth Connection Issues
1. Verify redirect URI matches exactly in Facebook App settings
2. Check `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET` are correct
3. Ensure app is in "Live" mode (not Development)
4. Check Instagram account permissions

### Media Upload Issues
1. Verify file size is within limits
2. Check file format is supported (JPG, PNG, MP4)
3. Ensure media URLs are accessible
4. Check storage permissions

## Best Practices
- Schedule posts during your audience's peak engagement times
- Use relevant hashtags (5-10 per post)
- Include engaging captions with calls-to-action
- Test with a few posts before scheduling many
- Monitor analytics to optimize posting times
- Keep access tokens secure and refresh when needed

## Support
For issues or questions:
1. Check the setup guides (`INSTAGRAM_API_SETUP.md`, `VERCEL_CRON_SETUP.md`)
2. Review error messages in the dashboard
3. Check server logs for detailed error information
4. Contact support if issues persist
