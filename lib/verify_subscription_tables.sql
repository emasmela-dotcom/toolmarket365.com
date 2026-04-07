-- Verification queries to check if tables were created correctly

-- 1. Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('plans', 'user_subscriptions', 'content_snapshots', 'tool_access_log')
ORDER BY table_name;

-- 2. Check plans table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'plans'
ORDER BY ordinal_position;

-- 3. Check if plans were inserted (should show 5 plans)
SELECT name, display_name, price_monthly, array_length(tool_slugs, 1) as tool_count
FROM plans
ORDER BY price_monthly;

-- 4. Check user_subscriptions table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_subscriptions'
ORDER BY ordinal_position;

-- 5. Check content_snapshots table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'content_snapshots'
ORDER BY ordinal_position;

-- 6. Check indexes were created
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('plans', 'user_subscriptions', 'content_snapshots', 'tool_access_log')
ORDER BY tablename, indexname;
