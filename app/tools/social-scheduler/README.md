# Social Scheduler

## What It Does
Database-backed social post scheduler powered by Neon Postgres. Create drafts, schedule posts with a date/time, and manage a single source of truth for your content plan across devices.

## How to Use

1. **Set up Neon:**
   - Ensure `DATABASE_URL` is set in `.env.local`
   - Run the latest `lib/schema.sql` in the Neon SQL editor (it includes the `scheduled_posts` table)

2. **Create a post:**
   - Choose platform and status
   - Optionally set "Scheduled for" (leave blank for drafts)
   - Add title (optional) and body (required)
   - Click "Create Post"

3. **Edit or delete:**
   - Click a post in the list to load it into the editor
   - Click "Save Changes" to update
   - Click the trash icon to delete

4. **Filter:**
   - Use the status filter to view drafts vs scheduled vs published.

## Expected Outcome

- Posts persist in Neon (not browser storage)
- Create/edit/delete works from the UI
- Filterable list of scheduled posts

