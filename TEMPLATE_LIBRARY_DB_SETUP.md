# Public Template Library - Database Setup

## Quick Setup (Automated)

Run the setup script:

```bash
npm run db:setup-templates
```

This will automatically execute the SQL schema against your Neon PostgreSQL database.

**Requirements:**
- `DATABASE_URL` must be set in your `.env.local` file
- Database connection must be accessible

## Manual Setup (Neon Console)

If you prefer to run the SQL manually:

1. **Open Neon Console**
   - Go to your Neon project dashboard
   - Click on your database
   - Open the SQL Editor

2. **Copy and Paste the Schema**
   - Open `lib/db/public-template-library-schema.sql`
   - Copy the entire contents
   - Paste into the Neon SQL Editor

3. **Execute**
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - Wait for all statements to complete

4. **Verify**
   - Check that the following tables exist:
     - `template_categories`
     - `template_platforms`
     - `template_voices`
     - `template_types`
   - Verify `content_templates` table has the new columns

## What Gets Created

### Tables Created:
- `template_categories` - Niche categories (fitness, tech, cooking, etc.)
- `template_platforms` - Social media platforms (Instagram, TikTok, etc.)
- `template_voices` - Content voices (professional, casual, etc.)
- `template_types` - Template types (caption, hashtag, blog_outline, etc.)

### Columns Added to `content_templates`:
- `niche` - Template niche/category
- `platform` - Target platform
- `voice` - Content voice/tone
- `template_type` - Type of template
- `is_public` - Public visibility flag
- `usage_count` - Number of times used
- `likes_count` - Number of likes
- `tags` - Array of tags
- `difficulty_level` - Beginner/intermediate/advanced
- `estimated_time_minutes` - Estimated time to use

### Sample Data:
- 4 sample templates (fitness, tech, cooking, fashion)
- 9 niche categories
- 7 platforms
- 6 voices
- 8 template types

## Troubleshooting

### Error: "relation already exists"
- This is normal if you've run the script before
- The `IF NOT EXISTS` clauses prevent duplicate creation
- Safe to ignore

### Error: "column already exists"
- The `ADD COLUMN IF NOT EXISTS` should prevent this
- If you see this, the column was already added
- Safe to ignore

### Connection Issues
- Verify `DATABASE_URL` in `.env.local`
- Check Neon dashboard for connection status
- Ensure your IP is allowed (if using IP restrictions)

## Next Steps

After setup:
1. Visit `/templates` to see the template library
2. Browse, search, and filter templates
3. Copy templates to use in your content

## Adding More Templates

To add templates manually via SQL:

```sql
INSERT INTO content_templates (
    id, user_id, name, description, template_data, category,
    niche, platform, voice, template_type, is_public, 
    tags, difficulty_level, estimated_time_minutes
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000', -- System user
    'Your Template Name',
    'Template description',
    '{"caption": "Your template content here"}'::jsonb,
    'social_media',
    'fitness', -- niche
    'instagram', -- platform
    'casual', -- voice
    'caption', -- template_type
    true, -- is_public
    ARRAY['tag1', 'tag2'], -- tags
    'beginner', -- difficulty_level
    5 -- estimated_time_minutes
);
```
