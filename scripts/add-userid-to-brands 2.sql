-- Add user_id column to brands table
ALTER TABLE brands 
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX idx_brands_user_id ON brands(user_id);

-- Update existing brands to have a default user (you'll need to adjust this)
UPDATE brands SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;

-- Make user_id required for new brands
ALTER TABLE brands ALTER COLUMN user_id SET NOT NULL;
