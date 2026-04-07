# 💳 Gumroad Setup Guide for CreatorFlow365

## 📋 **Products You Need to Create in Gumroad**

### **Subscription Plans (Monthly Recurring)**

1. **Starter Plan - $9/month**
   - Product Type: Subscription
   - Price: $9/month
   - Description: "CreatorFlow365 Starter Plan - 8 essential tools, 25 credits/month, perfect for new creators"
   - Recurring: Monthly

2. **Essential Plan - $19/month**
   - Product Type: Subscription
   - Price: $19/month
   - Description: "CreatorFlow365 Essential Plan - 18 professional tools, 30 credits/month, for creators building their workflow"
   - Recurring: Monthly

3. **Professional Plan - $49/month**
   - Product Type: Subscription
   - Price: $49/month
   - Description: "CreatorFlow365 Professional Plan - 35+ tools including Viral Content Predictor, 25 credits/month, for serious creators"
   - Recurring: Monthly

4. **Creator Plan - $79/month**
   - Product Type: Subscription
   - Price: $79/month
   - Description: "CreatorFlow365 Creator Plan - All 43+ tools with unlimited uses, unlimited content library, complete toolkit for professional creators"
   - Recurring: Monthly

5. **Business Plan - $149/month**
   - Product Type: Subscription
   - Price: $149/month
   - Description: "CreatorFlow365 Business Plan - All 43+ tools for teams and agencies, enterprise features, dedicated support"
   - Recurring: Monthly

### **Credit Bundles (One-Time Payments)**

4. **50 Credits - $5**
   - Product Type: One-time payment
   - Price: $5
   - Description: "50 Credits for CreatorFlow365 premium tools. Perfect for trying premium features."

5. **100 Credits - $10** (Most Popular)
   - Product Type: One-time payment
   - Price: $10
   - Description: "100 Credits for CreatorFlow365 premium tools. Best value for regular users."

6. **250 Credits - $22.50** (10% discount)
   - Product Type: One-time payment
   - Price: $22.50
   - Description: "250 Credits for CreatorFlow365 premium tools. Power user bundle with 10% savings."

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Products in Gumroad**

1. Go to [gumroad.com](https://gumroad.com) and log in
2. Click **"Products"** → **"New Product"**
3. For each product above:
   - Enter product name
   - Set price
   - Choose product type (Subscription or One-time)
   - Add description
   - Save product
4. Copy the **"Share"** link for each product (e.g., `https://masela.gumroad.com/l/starter-plan`)

### **Step 2: Get Product Links**

After creating products, you'll get links like:
- `https://masela.gumroad.com/l/creatorflow365-starter`
- `https://masela.gumroad.com/l/creatorflow365-essential`
- `https://masela.gumroad.com/l/creatorflow365-professional`
- `https://masela.gumroad.com/l/credits-50`
- `https://masela.gumroad.com/l/credits-100`
- `https://masela.gumroad.com/l/credits-250`

### **Step 3: Add Gumroad Script to Your Site**

Add this to your main layout file (`app/layout.tsx`):

```html
<script src="https://gumroad.com/js/gumroad.js"></script>
```

### **Step 4: Update Pricing Page**

Replace the "Start Free Trial" buttons with Gumroad subscription buttons.

### **Step 5: Update Credits Page**

Add "Buy Now" buttons for each credit bundle.

---

## 🔧 **Integration Code Examples**

### **Subscription Button (for Pricing Page):**

```html
<a href="https://masela.gumroad.com/l/creatorflow365-starter" 
   class="gumroad-button" 
   data-gumroad-single-product="true">
  Subscribe Now - $9/month
</a>
```

### **Credit Bundle Button (for Credits Page):**

```html
<a href="https://masela.gumroad.com/l/credits-100" 
   class="gumroad-button" 
   data-gumroad-single-product="true">
  Buy 100 Credits - $10
</a>
```

---

## ✅ **Testing Checklist**

- [ ] All 8 products created in Gumroad (5 subscriptions + 3 credit bundles)
- [ ] Product links copied
- [ ] Gumroad script added to layout
- [ ] Pricing page buttons updated
- [ ] Credits page buttons updated
- [ ] Test checkout flow (use Gumroad test mode)
- [ ] Verify subscription setup works
- [ ] Verify one-time payments work

---

## 📝 **Notes**

- **Test Mode**: Enable test mode in Gumroad to test without real payments
- **Payouts**: You control when to withdraw from Gumroad
- **Fees**: Gumroad charges 10% transaction fee
- **Subscriptions**: Gumroad handles recurring billing automatically

---

## 🎯 **Next Steps After Setup**

1. Test all payment flows
2. Monitor first few transactions
3. Set up email notifications in Gumroad
4. Plan migration to Stripe when revenue grows (to save on fees)
