-- ToolMarket365: one plan, $0.99/month, full site access (run in Neon SQL Editor)
UPDATE plans
SET
  display_name = 'ToolMarket365',
  price_monthly = 0.99,
  price_yearly = NULL,
  features = COALESCE(features, '{}'::jsonb) || '{"all_tools": true}'::jsonb
WHERE name = 'starter';
