-- Fix brands table schema
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Update existing brands to have a user_id (you'll need to set this appropriately)
-- UPDATE brands SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;

-- Make user_id required after setting values
-- ALTER TABLE brands ALTER COLUMN user_id SET NOT NULL;
