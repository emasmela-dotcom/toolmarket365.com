# Rebuild Instructions - Micro-SaaS Marketplace

**Save this file!** These are the steps to rebuild your project from scratch if needed.

## Quick Rebuild Steps

```bash
# 1. Clone the repository
git clone https://github.com/emasmela-dotcom/Micro-SaaS-marketplace.git
cd Micro-SaaS-marketplace

# 2. Install dependencies
npm install

# 3. Create .env.local file with your Neon database connection
# (You'll need to get this from Neon Console or your saved copy)
echo 'DATABASE_URL=postgresql://neondb_owner:npg_4s5YwWPXvSOB@ep-dry-waterfall-ahwpqcaw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' > .env.local

# 4. Initialize the database (run schema.sql in Neon SQL Editor)
# Copy lib/schema.sql and run it in Neon Console → SQL Editor

# 5. Start development server
npm run dev
```

## Important Notes

- **Port 3002**: This project runs on port 3002 (not 3000 or 3001)
- **Database**: You need your Neon DATABASE_URL connection string
- **Database Schema**: Run `lib/schema.sql` in Neon SQL Editor to create tables

## What Gets Rebuilt Automatically

- All source code (120 files) - from GitHub
- Dependencies - from `npm install`
- Build files - from `npm run build` or `npm run dev`

## What You Need to Provide

- `.env.local` file with DATABASE_URL (not in git for security)
- Database schema initialization (one-time setup in Neon)

## Vercel Deployment

If connected to Vercel, deployments happen automatically on every git push.
Check: https://vercel.com/dashboard


