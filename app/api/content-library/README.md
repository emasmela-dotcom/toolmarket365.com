# Content Library API

Complete REST API for managing content library with advanced features.

## 🎯 API Features Summary

### Main Routes (`/api/content-library/`)

- **GET**: List content with advanced filters, search, pagination
  - Filter by: tags, content_type, status, collection_id, is_favorite
  - Search across: title, description, tags, content_data
  - Pagination: limit, offset
  - Sorting: any field, asc/desc
  
- **POST**: Create new content with full metadata support
  - Full content_data JSONB support
  - Tags array support
  - Collection assignment
  - Status management
  - Metadata storage

### Individual Item (`/api/content-library/[id]`)

- **GET**: Retrieve single item with full details
  - Includes collection name
  - Full metadata and performance data
  
- **PUT**: Update any fields with partial update support
  - Only updates provided fields
  - Automatic updated_at timestamp
  - Status change handling (published_at)
  
- **DELETE**: Remove item with proper validation
  - User ownership verification
  - Cascade handling for relationships

### Collections (`/api/content-library/collections`)

- **GET**: List collections with item counts
  - Filter by: is_public
  - Optional item count inclusion
  
- **POST**: Create new collections
  - Full metadata support
  - Tags and organization
  
- **GET /[id]**: Get single collection
- **PUT /[id]**: Update collection
- **DELETE /[id]**: Delete collection

### Templates (`/api/content-library/templates`)

- **GET**: List templates (user + public) with sorting
  - Filter by: category, is_public
  - Sort by: usage_count, created_at
  
- **POST**: Create new templates
  - Template data JSONB
  - Category support
  - Public/private templates

### Search (`/api/content-library/search`)

- **POST**: Advanced search with relevance scoring
  - Full-text search across multiple fields
  - Complex filtering with date ranges
  - Sort by relevance or any field
  - Pagination support

## ✅ Key Features

- ✅ **Full TypeScript Support** - Complete type safety
- ✅ **PostgreSQL JSONB** - Native JSONB field handling
- ✅ **Advanced Filtering** - Multiple filter combinations
- ✅ **Full-Text Search** - PostgreSQL full-text search
- ✅ **Pagination** - Efficient pagination with counts
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Partial Updates** - Only update provided fields
- ✅ **Performance** - Optimized indexes and queries
- ✅ **Flexible Sorting** - Sort by any field
- ✅ **Collection Support** - Full collection management
- ✅ **Template System** - Reusable content templates
- ✅ **Search Relevance** - Relevance-based search results

## 📊 Database Schema

All tables are defined in `lib/schema.sql`:

- `content_library` - Main content storage
- `content_collections` - Organization/folders
- `content_templates` - Reusable templates
- `content_versions` - Version history
- `content_relationships` - Content linking

## 🔧 Technology Stack

- **Database**: Neon PostgreSQL (`@neondatabase/serverless`)
- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Data Format**: JSONB for flexible content storage

## 📝 Usage Examples

See `TESTING.md` for complete testing guide and examples.

## 🚀 Next Steps

1. Build enhanced Content Library UI page
2. Integrate with Viral Content Predictor
3. Connect to Content Performance Dashboard
4. Add authentication (currently using 'anonymous' user)

---

**Your complete Content Library API is ready to use!** 🚀
