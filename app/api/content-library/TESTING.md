# Content Library API Testing Guide

## Important Notes

- **Port**: This project runs on **port 3002** (not 3000)
- **Base URL**: `http://localhost:3002/api/content-library`
- **Database**: Make sure your Neon database is set up and `DATABASE_URL` is configured in `.env.local`

## Quick Test Script

Run the automated test script:

```bash
./scripts/test-content-library-api.sh
```

Or manually test each endpoint:

## Manual Testing Commands

### 1. Create a Content Item

```bash
curl -X POST http://localhost:3002/api/content-library \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Content",
    "description": "This is a test content item",
    "content_type": "text",
    "content_data": {"text": "Hello World", "format": "markdown"},
    "tags": ["test", "demo"],
    "status": "published"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "My First Content",
    ...
  }
}
```

### 2. Get All Content Items

```bash
curl "http://localhost:3002/api/content-library?limit=10&offset=0"
```

**Query Parameters:**
- `limit` - Number of items to return (max 100, default 50)
- `offset` - Pagination offset (default 0)
- `search` - Search term
- `tags` - Comma-separated tags
- `content_type` - Comma-separated content types
- `status` - Comma-separated statuses
- `collection_id` - Filter by collection
- `is_favorite` - true/false
- `sort_by` - Field to sort by (default: created_at)
- `sort_order` - asc/desc (default: desc)

### 3. Get Single Content Item

```bash
curl "http://localhost:3002/api/content-library/{id}"
```

Replace `{id}` with the actual content ID from step 1.

### 4. Update Content Item

```bash
curl -X PUT http://localhost:3002/api/content-library/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "is_favorite": true
  }'
```

### 5. Delete Content Item

```bash
curl -X DELETE http://localhost:3002/api/content-library/{id}
```

### 6. Advanced Search

```bash
curl -X POST http://localhost:3002/api/content-library/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "hello",
    "tags": ["test"],
    "content_type": ["text"],
    "status": ["published"],
    "limit": 20,
    "offset": 0,
    "sort_by": "relevance",
    "sort_order": "desc"
  }'
```

**Search Options:**
- `query` - Text search across title, description, content, tags
- `tags` - Array of tags to filter by
- `content_type` - Array of content types
- `status` - Array of statuses
- `collection_id` - Filter by collection
- `date_range` - `{start: "2024-01-01", end: "2024-12-31"}`
- `is_favorite` - true/false
- `sort_by` - "relevance", "created_at", "updated_at", "title"
- `sort_order` - "asc" or "desc"

### 7. Create Collection

```bash
curl -X POST http://localhost:3002/api/content-library/collections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Collection",
    "description": "A test collection",
    "tags": ["collection", "test"],
    "is_public": false
  }'
```

### 8. Get All Collections

```bash
curl "http://localhost:3002/api/content-library/collections?include_item_count=true"
```

**Query Parameters:**
- `include_item_count` - Include item count for each collection (default: false)
- `is_public` - Filter by public/private (default: all)

### 9. Get Single Collection

```bash
curl "http://localhost:3002/api/content-library/collections/{id}"
```

### 10. Update Collection

```bash
curl -X PUT http://localhost:3002/api/content-library/collections/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Collection Name",
    "description": "Updated description"
  }'
```

### 11. Delete Collection

```bash
curl -X DELETE http://localhost:3002/api/content-library/collections/{id}
```

### 12. Get Templates

```bash
curl "http://localhost:3002/api/content-library/templates?include_public=true&category=content"
```

**Query Parameters:**
- `include_public` - Include public templates (default: true)
- `category` - Filter by category
- `sort_by_usage` - Sort by usage count (default: false)

### 13. Create Template

```bash
curl -X POST http://localhost:3002/api/content-library/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Template",
    "description": "A test template",
    "template_data": {"structure": "example"},
    "category": "content",
    "tags": ["template", "test"],
    "is_public": false
  }'
```

## Testing Checklist

- [ ] Create content item
- [ ] List content items with filters
- [ ] Get single content item
- [ ] Update content item
- [ ] Delete content item
- [ ] Advanced search
- [ ] Create collection
- [ ] List collections
- [ ] Update collection
- [ ] Delete collection
- [ ] Create template
- [ ] List templates

## Common Issues

1. **503 Error**: Database not configured
   - Check that `DATABASE_URL` is set in `.env.local`
   - Verify database connection

2. **404 Error**: Route not found
   - Make sure dev server is running: `npm run dev`
   - Check that you're using port 3002

3. **500 Error**: Database error
   - Check that tables exist (run `lib/schema.sql` in Neon SQL Editor)
   - Verify database schema matches API expectations

## Next Steps

After testing the API endpoints, you can:
1. Build the enhanced Content Library UI page
2. Integrate with Viral Content Predictor
3. Connect to Content Performance Dashboard
4. Add authentication (currently using 'anonymous' user)
