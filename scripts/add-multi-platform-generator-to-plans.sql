-- ============================================
-- Add multi-platform-generator to Essential+ plans
-- Run this script to update existing plans in your database
-- ============================================

-- Add multi-platform-generator to Essential plan
UPDATE plans
SET tool_slugs = array_append(tool_slugs, 'multi-platform-generator')
WHERE name = 'essential'
  AND NOT ('multi-platform-generator' = ANY(tool_slugs));

-- Add social-graphics to Essential plan (if missing)
UPDATE plans
SET tool_slugs = array_append(tool_slugs, 'social-graphics')
WHERE name = 'essential'
  AND NOT ('social-graphics' = ANY(tool_slugs));

-- Add multi-platform-generator to Professional plan
UPDATE plans
SET tool_slugs = array_append(tool_slugs, 'multi-platform-generator')
WHERE name = 'professional'
  AND NOT ('multi-platform-generator' = ANY(tool_slugs));

-- Add multi-platform-generator to Creator plan
UPDATE plans
SET tool_slugs = array_append(tool_slugs, 'multi-platform-generator')
WHERE name = 'creator'
  AND NOT ('multi-platform-generator' = ANY(tool_slugs));

-- Add multi-platform-generator to Business plan
UPDATE plans
SET tool_slugs = array_append(tool_slugs, 'multi-platform-generator')
WHERE name = 'business'
  AND NOT ('multi-platform-generator' = ANY(tool_slugs));

-- Verify the update
SELECT 
  name,
  display_name,
  array_length(tool_slugs, 1) as tool_count,
  CASE 
    WHEN 'multi-platform-generator' = ANY(tool_slugs) THEN '✓ Included'
    ELSE '✗ Missing'
  END as multi_platform_generator_status
FROM plans
WHERE name IN ('essential', 'professional', 'creator', 'business')
ORDER BY price_monthly;
