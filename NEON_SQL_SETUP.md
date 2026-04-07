# 🗄️ Neon SQL Setup Guide

## ✅ **Yes - You Need to Run SQL in Neon!**

Your database needs to be initialized with tables and schema. Here's what to run:

---

## 🎯 **Main Schema (REQUIRED)**

### **File: `lib/schema.sql`**

**This is the main schema file** - contains all core tables:
- Users & Authentication
- Sessions
- Comments
- Analytics
- Tool Usage
- Content Library
- Subscriptions
- And more...

**How to Run:**

#### **Option 1: Neon Console (Recommended)**
1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Click **"SQL Editor"**
4. Open `lib/schema.sql` in your code editor
5. Copy the **entire contents**
6. Paste into Neon SQL Editor
7. Click **"Run"** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

#### **Option 2: Automated Script**
```bash
npm run db:init
```

**This runs:** `scripts/db-init.mjs` which executes `lib/schema.sql`

---

## 📋 **Additional SQL Files (Optional - As Needed)**

### **1. Growth Suite Schema**
**File:** `scripts/create-growth-suite-schema.sql`

**When to run:** If using Growth Suite features (brand profiles, creator profiles, deals)

**How to run:**
- Copy contents
- Paste into Neon SQL Editor
- Run

---

### **2. Content Library Schema**
**File:** `scripts/create-content-items-schema.sql`

**When to run:** If using Content Library features

**Note:** May already be included in main `lib/schema.sql` - check first!

---

### **3. Tags & Metadata Schema**
**File:** `scripts/create-tags-metadata-schema.sql`

**When to run:** If using advanced tagging and metadata features

---

### **4. Store Metadata Schema**
**File:** `scripts/create-store-metadata-table.sql`

**When to run:** If using store metadata features

---

### **5. Template Library Schema**
**File:** `lib/db/template-favorites-schema.sql`

**When to run:** If using template favorites feature

**Or use automated script:**
```bash
npm run db:setup-templates
```

---

### **6. Subscription Tables**
**File:** `lib/subscription_tables.sql`

**When to run:** If using subscription features

---

### **7. Caption Bot Schema**
**File:** `lib/db/caption-bot-schema.sql`

**When to run:** If using caption bot features

---

### **8. User API Keys Schema**
**File:** `lib/db/user-api-keys-schema.sql`

**When to run:** If using API key features

---

### **9. Additional Templates**
**File:** `lib/db/additional-templates.sql`

**When to run:** To add more template data

---

### **10. Growth Suite Fixes**
**Files:**
- `scripts/add-userid-to-brands.sql`
- `scripts/fix-brands-userid.sql`

**When to run:** If you need to fix brand user_id relationships

---

## 🚀 **Quick Start (Minimum Required)**

### **For Basic Setup:**

1. **Run Main Schema:**
   ```bash
   # Option A: Automated
   npm run db:init
   
   # Option B: Manual
   # Copy lib/schema.sql → Neon SQL Editor → Run
   ```

2. **Verify Tables Created:**
   - Go to Neon Console → Your Database
   - Check that tables exist:
     - `users`
     - `sessions`
     - `comments`
     - `analytics`
     - `tool_usage`
     - And others...

---

## 📝 **Step-by-Step: Running SQL in Neon**

### **Method 1: Neon Console (Easiest)**

1. **Go to Neon Dashboard:**
   - Visit [console.neon.tech](https://console.neon.tech)
   - Log in
   - Select your project

2. **Open SQL Editor:**
   - Click on your database
   - Click **"SQL Editor"** tab
   - You'll see a query editor

3. **Copy SQL File:**
   - Open `lib/schema.sql` in your code editor
   - Select all (`Cmd+A` / `Ctrl+A`)
   - Copy (`Cmd+C` / `Ctrl+C`)

4. **Paste & Run:**
   - Paste into Neon SQL Editor
   - Click **"Run"** button
   - Or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

5. **Check Results:**
   - Look for "Success" message
   - Check for any errors
   - Verify tables were created

---

### **Method 2: Automated Script**

```bash
# Make sure DATABASE_URL is set in .env.local
npm run db:init
```

**This will:**
- Read `lib/schema.sql`
- Execute all SQL statements
- Skip statements that already exist (safe to run multiple times)
- Show success/error messages

---

## ✅ **Verification Checklist**

After running SQL, verify these tables exist:

### **Core Tables:**
- [ ] `users` - User accounts
- [ ] `sessions` - Authentication sessions
- [ ] `comments` - Community comments
- [ ] `analytics` - Analytics tracking
- [ ] `tool_usage` - Tool usage stats

### **Content Tables:**
- [ ] `content_items` - Content library items
- [ ] `content_tags` - Content tagging
- [ ] `content_metadata` - Content metadata

### **Subscription Tables:**
- [ ] `subscriptions` - User subscriptions
- [ ] `subscription_plans` - Available plans

### **Other Tables:**
- [ ] `password_resets` - Password reset tokens
- [ ] `uploads` - File uploads
- [ ] `tags` - Tag definitions

---

## 🚨 **Common Issues**

### **Error: "relation already exists"**
- **Cause:** Tables already created
- **Solution:** This is OK! The `IF NOT EXISTS` clauses prevent duplicates
- **Action:** Safe to ignore, or skip those statements

### **Error: "permission denied"**
- **Cause:** Database user doesn't have CREATE TABLE permission
- **Solution:** Check your database user permissions in Neon
- **Action:** Use the database owner account

### **Error: "syntax error"**
- **Cause:** SQL syntax issue
- **Solution:** Check the SQL file for errors
- **Action:** Run statements one at a time to find the issue

---

## 📊 **What Each Schema File Does**

### **`lib/schema.sql` (Main)**
- Creates all core tables
- Sets up indexes
- Creates relationships (foreign keys)
- **Run this first!**

### **`scripts/create-growth-suite-schema.sql`**
- Growth Suite tables (brands, creators, deals)
- Only if using Growth Suite features

### **`scripts/create-content-items-schema.sql`**
- Content Library tables
- May already be in main schema

### **`lib/subscription_tables.sql`**
- Subscription management tables
- Plans, subscriptions, payments

---

## 🎯 **Recommended Order**

### **For First-Time Setup:**

1. **Run Main Schema:**
   ```bash
   npm run db:init
   # OR manually run lib/schema.sql
   ```

2. **Run Template Library (if needed):**
   ```bash
   npm run db:setup-templates
   ```

3. **Run Additional Schemas (as needed):**
   - Growth Suite (if using)
   - Subscription tables (if using)
   - Other features (as needed)

---

## ✅ **Summary**

**Required:**
- ✅ Run `lib/schema.sql` (main schema)

**Optional (as needed):**
- Growth Suite schema
- Template library schema
- Subscription tables
- Other feature-specific schemas

**How to Run:**
1. Neon Console → SQL Editor → Paste → Run
2. OR: `npm run db:init` (automated)

**Verify:**
- Check tables exist in Neon Console
- Test your application

---

## 🚀 **Quick Command Reference**

```bash
# Run main schema
npm run db:init

# Setup template library
npm run db:setup-templates

# Check database connection
# (Make sure DATABASE_URL is in .env.local)
```

**That's it!** Once you run the main schema, your database is ready! 🎉
