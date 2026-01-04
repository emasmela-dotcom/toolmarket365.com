# Backend Setup Guide

## Neon Database Setup

1. **Create a Neon account** at https://neon.tech
2. **Create a new project** and get your connection string
3. **Set environment variable**:
   ```bash
   # Create .env.local file
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```

## Initialize Database

Run the SQL schema in your Neon SQL Editor:

```bash
# Copy the contents of lib/schema.sql and run it in Neon's SQL Editor
```

Or use the Neon CLI:
```bash
# Install Neon CLI (if needed)
npm install -g neonctl

# Run the schema
neonctl sql --project-id YOUR_PROJECT_ID < lib/schema.sql
```

## API Endpoints

### Comments API
- `GET /api/comments` - Get all comments
- `POST /api/comments` - Create a new comment
  ```json
  {
    "name": "John Doe",
    "message": "Great tool!"
  }
  ```
- `DELETE /api/comments/[id]` - Delete a comment

### Analytics API
- `POST /api/analytics` - Record analytics event
  ```json
  {
    "page": "/tools",
    "device": "desktop",
    "referrer": "https://google.com",
    "site": "example.com",
    "user_agent": "Mozilla/5.0..."
  }
  ```
- `GET /api/analytics?days=7` - Get analytics summary (last N days)

## Install Dependencies

```bash
npm install
```

## Development

The backend will automatically use Neon when `DATABASE_URL` is set. If not set, API endpoints will return 503 errors.

## Database Schema

- **comments**: Stores community board messages
- **analytics**: Tracks page views and user behavior
- **tool_usage**: Tracks tool usage statistics

See `lib/schema.sql` for full schema details.

