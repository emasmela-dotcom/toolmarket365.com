-- CreatorFlow Growth Suite Database Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    website TEXT,
    industry VARCHAR(100),
    description TEXT,
    logo_url TEXT,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    budget_range VARCHAR(50), -- e.g., "$1K-$5K", "$5K-$10K", "$10K+"
    preferred_creator_types TEXT[], -- e.g., ['lifestyle', 'tech', 'fitness']
    preferred_platforms TEXT[], -- e.g., ['instagram', 'youtube', 'tiktok']
    min_followers INTEGER DEFAULT 0,
    max_followers INTEGER,
    target_demographics JSONB, -- age, gender, location, interests
    campaign_types TEXT[], -- e.g., ['sponsored_post', 'product_review', 'brand_ambassador']
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator Profiles (for Growth Suite)
CREATE TABLE IF NOT EXISTS creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Links to users table
    display_name VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_image_url TEXT,
    website TEXT,
    location VARCHAR(255),
    niche VARCHAR(100), -- e.g., 'lifestyle', 'tech', 'fitness', 'food'
    content_types TEXT[], -- e.g., ['video', 'photo', 'blog']
    platforms JSONB DEFAULT '{}', -- {instagram: {handle, followers, engagement_rate}, youtube: {...}}
    audience_demographics JSONB, -- age, gender, location breakdown
    average_engagement_rate DECIMAL(5,2), -- percentage
    total_followers INTEGER DEFAULT 0,
    portfolio_urls TEXT[], -- Links to best work
    rates JSONB, -- {sponsored_post: 500, product_review: 300, etc.}
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
    is_public BOOLEAN DEFAULT true, -- Whether profile is visible to brands
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_profile UNIQUE(user_id)
);

-- Deals/Campaigns Table
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL, -- Links to user_id
    creator_profile_id UUID REFERENCES creator_profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deal_type VARCHAR(50) NOT NULL, -- 'sponsored_post', 'product_review', 'brand_ambassador', 'affiliate'
    platform VARCHAR(50), -- 'instagram', 'youtube', 'tiktok', 'all'
    deliverables TEXT[], -- What creator needs to deliver
    budget DECIMAL(10,2) NOT NULL,
    commission_percentage DECIMAL(5,2) DEFAULT 10.00, -- CreatorFlow commission (10%)
    creator_payout DECIMAL(10,2), -- What creator receives after commission
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'negotiating', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed')),
    deadline DATE,
    requirements TEXT, -- Brand requirements
    creator_notes TEXT, -- Creator's notes/concerns
    brand_notes TEXT, -- Brand's internal notes
    contract_url TEXT, -- Link to signed contract
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Deal Messages (Communication between brand and creator)
CREATE TABLE IF NOT EXISTS deal_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL, -- user_id of sender
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('brand', 'creator', 'system')),
    message TEXT NOT NULL,
    attachments JSONB, -- URLs to attached files
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions (Payment tracking)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'payment', 'refund', 'commission'
    payment_method VARCHAR(50), -- 'stripe', 'paypal', 'bank_transfer'
    payment_provider_id VARCHAR(255), -- External payment ID
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    fees DECIMAL(10,2) DEFAULT 0, -- Platform fees
    net_amount DECIMAL(10,2), -- Amount after fees
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Brand Saved Creators (Brands can save/favorite creators)
CREATE TABLE IF NOT EXISTS brand_saved_creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    notes TEXT, -- Brand's private notes about this creator
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_brand_creator_save UNIQUE(brand_id, creator_profile_id)
);

-- Creator Saved Brands (Creators can save/favorite brands)
CREATE TABLE IF NOT EXISTS creator_saved_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    notes TEXT, -- Creator's private notes about this brand
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_creator_brand_save UNIQUE(creator_id, brand_id)
);

-- Deal Reviews (After deal completion)
CREATE TABLE IF NOT EXISTS deal_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL, -- user_id of reviewer
    reviewer_type VARCHAR(20) NOT NULL CHECK (reviewer_type IN ('brand', 'creator')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_deal_review UNIQUE(deal_id, reviewer_id, reviewer_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_brands_status ON brands(status);
CREATE INDEX IF NOT EXISTS idx_brands_industry ON brands(industry);
CREATE INDEX IF NOT EXISTS idx_brands_verified ON brands(is_verified) WHERE is_verified = true;

CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_niche ON creator_profiles(niche);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_public ON creator_profiles(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_creator_profiles_verified ON creator_profiles(is_verified) WHERE is_verified = true;

CREATE INDEX IF NOT EXISTS idx_deals_brand_id ON deals(brand_id);
CREATE INDEX IF NOT EXISTS idx_deals_creator_id ON deals(creator_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_deal_type ON deals(deal_type);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_deal_messages_deal_id ON deal_messages(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_messages_created_at ON deal_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_deal_id ON transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_transactions_brand_id ON transactions(brand_id);
CREATE INDEX IF NOT EXISTS idx_transactions_creator_id ON transactions(creator_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_brand_saved_creators_brand_id ON brand_saved_creators(brand_id);
CREATE INDEX IF NOT EXISTS idx_creator_saved_brands_creator_id ON creator_saved_brands(creator_id);

CREATE INDEX IF NOT EXISTS idx_deal_reviews_deal_id ON deal_reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_reviews_reviewer ON deal_reviews(reviewer_id, reviewer_type);
