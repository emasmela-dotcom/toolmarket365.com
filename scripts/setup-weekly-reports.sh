#!/bin/bash
# Save as: setup-weekly-reports.sh

echo "🚀 Setting up Weekly Performance Report Bot..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install @neondatabase/serverless openai @hookform/resolvers zod react-hook-form date-fns lucide-react

# 2. Create directory structure
echo "📁 Creating directory structure..."
mkdir -p app/tools/weekly-reports
mkdir -p app/tools/weekly-reports/create
mkdir -p app/tools/weekly-reports/[id]
mkdir -p api/reports/config
mkdir -p api/reports/generate
mkdir -p api/reports/weekly
mkdir -p lib/report-generator

# 3. Set environment variables
echo "🔐 Setting up environment variables..."
cat >> .env.local << EOF
DATABASE_URL=your-neon-postgresql-url
OPENAI_API_KEY=your-openai-api-key
CRON_SECRET=your-cron-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
EOF

# 4. Create database tables
echo "🗄️ Creating database tables..."
# Run the SQL schema above in your Neon database

# 5. Deploy cron job (Vercel example)
echo "⏰ Setting up cron job..."
cat >> vercel.json << EOF
{
  "crons": [
    {
      "path": "/api/reports/weekly/cron",
      "schedule": "0 9 * * MON"  # Every Monday at 9 AM
    }
  ]
}
EOF

echo "✅ Setup complete! Visit /tools/weekly-reports to get started."
