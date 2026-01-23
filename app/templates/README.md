# Public Template Library

A comprehensive public template library system that allows users to browse, search, filter, and copy content templates across different niches, platforms, voices, and template types.

## Features

- **Browse Public Templates**: Access a curated library of content templates
- **Advanced Filtering**: Filter by niche, platform, voice, and template type
- **Search Functionality**: Search templates by name, description, or tags
- **Sorting Options**: Sort by popularity, newest, most used, or most liked
- **One-Click Copy**: Copy templates directly to clipboard
- **Usage Tracking**: System tracks how many times each template is used
- **Responsive Design**: Mobile-first design with dark mode support

## Database Setup

Before using the template library, you need to run the database schema:

1. Open your Neon PostgreSQL database console
2. Run the SQL script from `lib/db/public-template-library-schema.sql`
3. This will create:
   - Enhanced `content_templates` table with new columns
   - `template_categories` table (niches)
   - `template_platforms` table
   - `template_voices` table
   - `template_types` table
   - Sample template data

## API Routes

### GET `/api/templates/public`

Fetch public templates with filtering and pagination.

**Query Parameters:**
- `niche` - Filter by niche (e.g., 'fitness', 'tech', 'cooking')
- `platform` - Filter by platform (e.g., 'instagram', 'twitter', 'linkedin')
- `voice` - Filter by voice (e.g., 'professional', 'casual', 'humorous')
- `template_type` - Filter by type (e.g., 'caption', 'hashtag', 'blog_outline')
- `search` - Search query for name, description, or tags
- `sort_by` - Sort order: 'popular', 'newest', 'most_used', 'most_liked'
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "templates": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "filterOptions": {
    "niches": [...],
    "platforms": [...],
    "voices": [...],
    "templateTypes": [...]
  }
}
```

### POST `/api/templates/public`

Track template usage (increments usage count).

**Body:**
```json
{
  "templateId": "uuid-here"
}
```

## Template Types

- **Caption**: Social media captions and post text
- **Content Idea**: Content topic and concept ideas
- **Hashtag**: Hashtag sets and trending tags
- **Blog Outline**: Blog post structure and outlines
- **Script**: Video and audio scripts
- **Headline**: Catchy titles and headlines
- **Description**: Product and service descriptions
- **Bio**: Profile and bio text

## Platforms Supported

- Instagram (2200 char limit)
- TikTok (150 char limit)
- YouTube (5000 char limit)
- Twitter (280 char limit)
- Facebook (63206 char limit)
- LinkedIn (3000 char limit)
- Universal (no limit)

## Voices Supported

- Professional
- Casual
- Humorous
- Educational
- Inspirational
- Enthusiastic

## Niches Supported

- Fitness & Health
- Technology
- Cooking & Food
- Fashion & Beauty
- Business & Finance
- Travel & Adventure
- Education & Learning
- Entertainment
- General

## Usage

1. Navigate to `/templates` in your browser
2. Use the search bar to find templates
3. Apply filters using the dropdown menus
4. Click "Copy" on any template to copy it to your clipboard
5. The system automatically tracks usage when you copy a template

## Adding New Templates

To add new templates to the library, insert them into the `content_templates` table with:
- `is_public = true`
- Appropriate `niche`, `platform`, `voice`, and `template_type` values
- `template_data` as JSONB with the template content

## Integration with Bots

The template library can be integrated with content creation bots to provide users with relevant templates based on their preferences and content profile.
