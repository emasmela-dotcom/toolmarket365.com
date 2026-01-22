# 🔒 Subscription & Trial System - Implementation Plan

## 📋 **Overview**

**Current Problem:** Tools are accessible to everyone without authentication or subscription.

**Solution:** Implement a complete subscription system where:
1. Users must create an account
2. Users must select a plan to access tools
3. 7-day free trial with full plan access
4. After trial: Subscribe to keep content OR restore pre-trial snapshot
5. No downgrades allowed (upgrades only)
6. Tools are gated by plan tier

---

## 🔄 **User Flow (Step-by-Step)**

### **Step 1: Account Creation**
```
User visits site → Clicks "Sign Up" → Creates account (email/password)
```

### **Step 2: Plan Selection**
```
After signup → Redirected to plan selection page
User selects: Starter ($9), Essential ($19), Professional ($49), Creator ($79), or Business ($149)
```

### **Step 3: Trial Starts**
```
User clicks "Start Free Trial" → Trial begins (7 days)
- Full access to selected plan's tools
- Can create content, use all tools in their tier
- No credit card required
- Content snapshot created (pre-trial state saved)
```

### **Step 4: During Trial**
```
User can:
✅ Use all tools in their selected plan
✅ Create content, save to library
✅ Access dashboard, analytics
❌ Cannot access tools from higher tiers
❌ Cannot downgrade (locked to selected plan)
```

### **Step 5: Trial Ends (Day 7)**
```
Two paths:

PATH A: User Subscribes (with credit card)
→ Keeps ALL content created during trial
→ Continues with selected plan
→ Can upgrade anytime
→ Cannot downgrade

PATH B: User Does NOT Subscribe
→ Account locked
→ Content restored to pre-trial snapshot
→ Must subscribe to regain access
```

### **Step 6: Active Subscription**
```
User can:
✅ Use all tools in their plan tier
✅ Upgrade to higher tier anytime
❌ Cannot downgrade
✅ Keep all content
```

---

## 🗄️ **Database Schema Changes**

### **1. Plans Table**
```sql
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'starter', 'essential', 'professional', 'creator', 'business'
  display_name VARCHAR(100) NOT NULL, -- 'Starter', 'Essential', etc.
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  trial_days INTEGER DEFAULT 7,
  tool_slugs TEXT[] NOT NULL, -- Array of tool slugs included in this plan
  features JSONB, -- Additional features/limits
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **2. User Subscriptions Table**
```sql
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('trial', 'active', 'expired', 'canceled')),
  trial_started_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_started_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id VARCHAR(255), -- For Stripe integration
  stripe_customer_id VARCHAR(255),
  can_downgrade BOOLEAN DEFAULT FALSE, -- Always FALSE after trial
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- One active subscription per user
);
```

### **3. Content Snapshots Table**
```sql
CREATE TABLE IF NOT EXISTS content_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snapshot_type VARCHAR(20) NOT NULL CHECK (snapshot_type IN ('pre_trial', 'trial_end', 'manual')),
  snapshot_data JSONB NOT NULL, -- Stores all user content at snapshot time
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE -- Only one active snapshot per type
);
```

### **4. Tool Access Log (Optional - for analytics)**
```sql
CREATE TABLE IF NOT EXISTS tool_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_slug VARCHAR(255) NOT NULL,
  plan_id UUID REFERENCES plans(id),
  access_granted BOOLEAN NOT NULL,
  reason TEXT, -- Why access was granted/denied
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🛡️ **Access Control System**

### **1. Middleware for Tool Routes**

Create `middleware.ts` in root:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect /tools/* routes
  if (request.nextUrl.pathname.startsWith('/tools/')) {
    // Check for auth cookie
    const sessionToken = request.cookies.get('session')?.value
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/account?redirect=' + request.nextUrl.pathname, request.url))
    }
    
    // Verify user has active subscription/trial
    // This will be done in the tool page component
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/tools/:path*', '/dashboard', '/content-library']
}
```

### **2. API Endpoint: Check Tool Access**

`app/api/tools/check-access/route.ts`:
```typescript
// Checks if user can access a specific tool
// Returns: { hasAccess: boolean, reason: string, plan: string }
```

### **3. Tool Page Protection**

Each tool page should:
1. Check if user is authenticated
2. Check if user has active trial/subscription
3. Check if tool is in their plan
4. Show upgrade prompt if tool not in plan
5. Block functionality if no access

---

## 📸 **Content Snapshot System**

### **When Snapshots Are Created:**

1. **Pre-Trial Snapshot** (when trial starts):
   - Capture: Empty state or existing content
   - Store: All content_library entries, scheduled_posts, viral_predictions, etc.
   - Purpose: Restore point if user doesn't subscribe

2. **Trial End Snapshot** (when trial expires):
   - Capture: All content created during trial
   - Store: Full state at trial end
   - Purpose: Backup before potential restore

### **Snapshot Data Structure:**
```json
{
  "content_library": [...],
  "scheduled_posts": [...],
  "viral_predictions": [...],
  "ab_tests": [...],
  "content_performance": [...],
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### **Restore Process:**
1. User doesn't subscribe after trial
2. System deletes all content created during trial
3. Restores pre-trial snapshot
4. User must subscribe to regain access

---

## 🎯 **Plan-to-Tool Mapping**

Based on `app/pricing/page.tsx`, here's the tool distribution:

### **Starter ($9/month) - 8 tools:**
- AI Caption Generator
- Content Idea Generator
- Hashtag Research
- Content Calendar
- Best Time to Post
- Readability Checker
- Bio Generator
- Content Library (100 items)

### **Essential ($19/month) - 18 tools:**
- Everything in Starter +
- Post Scheduler
- Analytics Dashboard
- SEO Optimizer
- Content Repurposer
- Video Script Generator
- Blog Outline Generator
- Engagement Calculator
- Hashtag Analyzer
- Social Media Report Generator
- Content Library (500 items)

### **Professional ($49/month) - 35+ tools:**
- Everything in Essential +
- Viral Content Predictor ⭐
- Video Transcript Generator
- Thumbnail Text Generator
- Quote Card Generator
- Image Alt Text Generator
- Podcast Show Notes Generator
- Competitor Analyzer
- Trend Tracker
- Content Gap Analyzer
- Brand Mention Tracker
- Sentiment Analyzer
- Follower Growth Tracker
- Cross-Platform Analytics
- Brand Kit Manager
- Color Palette Extractor
- Font Pairing Tool
- Style Guide Creator
- Profile Optimizer
- Rate Calculator
- Revenue Tracker
- Poll/Question Generator
- Giveaway Manager
- Influencer Outreach Tool
- Collaboration Manager
- Link in Bio Manager
- Link in Bio Optimizer
- Social Media Post Formatter
- Social Scheduler
- Content Library (unlimited)

### **Creator ($79/month) - All 43+ tools:**
- Everything in Professional +
- AI Lead Follow-Up Agent
- All remaining tools
- Unlimited everything

### **Business ($149/month):**
- Everything in Creator +
- Team features
- API access
- White-label
- Custom integrations

---

## 🔧 **Implementation Steps**

### **Phase 1: Database Setup**
- [ ] Add `plans` table
- [ ] Add `user_subscriptions` table
- [ ] Add `content_snapshots` table
- [ ] Seed plans data with tool mappings
- [ ] Create indexes

### **Phase 2: Authentication Enforcement**
- [ ] Update middleware to protect `/tools/*`
- [ ] Redirect unauthenticated users to `/account`
- [ ] Update Navigation to show login/signup when not authenticated

### **Phase 3: Plan Selection Flow**
- [ ] Create plan selection page (or update pricing page)
- [ ] After signup, redirect to plan selection
- [ ] Store selected plan in `user_subscriptions` with `status='trial'`
- [ ] Set `trial_started_at` and `trial_ends_at`

### **Phase 4: Content Snapshot System**
- [ ] Create API endpoint: `/api/snapshots/create`
- [ ] Create API endpoint: `/api/snapshots/restore`
- [ ] Create pre-trial snapshot when trial starts
- [ ] Create trial-end snapshot when trial expires

### **Phase 5: Tool Access Gating**
- [ ] Create API endpoint: `/api/tools/check-access`
- [ ] Create utility function: `getUserPlan(userId)`
- [ ] Create utility function: `canAccessTool(userId, toolSlug)`
- [ ] Update all tool pages to check access
- [ ] Show upgrade prompts for locked tools

### **Phase 6: Trial End Logic**
- [ ] Create API endpoint: `/api/subscriptions/trial-end`
- [ ] Check trial status on tool access
- [ ] Show "Trial Ending Soon" banner (3 days before)
- [ ] Show "Subscribe to Keep Content" modal on trial end
- [ ] Auto-restore snapshot if no subscription after grace period

### **Phase 7: Subscription Management**
- [ ] Integrate Stripe (or payment provider)
- [ ] Create checkout flow
- [ ] Handle subscription webhooks
- [ ] Update subscription status
- [ ] Block downgrades (enforce in UI and API)

### **Phase 8: UI Updates**
- [ ] Add "Upgrade" buttons to locked tools
- [ ] Add plan badge to user profile
- [ ] Add "Days Left in Trial" counter
- [ ] Add subscription management page
- [ ] Update pricing page with "Start Trial" flow

---

## 🚨 **Critical Rules**

1. **No Downgrades:** Once a user selects a plan, they can only upgrade. This is enforced in:
   - Database constraint
   - API validation
   - UI (hide downgrade options)

2. **Trial Content Retention:**
   - If user subscribes → Keep all content
   - If user doesn't subscribe → Restore pre-trial snapshot

3. **Tool Access:**
   - Tools are strictly gated by plan
   - No "free tier" access
   - Must have active trial or subscription

4. **Account Required:**
   - All tools require authentication
   - No anonymous usage
   - Sign up → Select plan → Start trial

---

## 📝 **API Endpoints Needed**

1. `POST /api/subscriptions/start-trial` - Start trial for selected plan
2. `GET /api/subscriptions/status` - Get user's subscription status
3. `POST /api/subscriptions/upgrade` - Upgrade to higher plan
4. `GET /api/tools/check-access?tool=video-script-generator` - Check tool access
5. `POST /api/snapshots/create` - Create content snapshot
6. `POST /api/snapshots/restore` - Restore content snapshot
7. `GET /api/plans` - Get all available plans
8. `POST /api/subscriptions/cancel` - Cancel subscription (end of period)

---

## ✅ **Next Steps**

1. **Review this plan** - Confirm flow matches your vision
2. **Start with Phase 1** - Database schema
3. **Then Phase 2** - Authentication enforcement
4. **Then Phase 3** - Plan selection flow
5. **Continue through phases** - Build incrementally

**Ready to start implementation?** Let me know which phase to begin with!
