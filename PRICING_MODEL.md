# 💰 Kovari Pricing Model - Credits System

**Last Updated:** October 13, 2025  
**Model Type:** Hybrid (Free Tier + Pay-Per-Use Credits + Optional Subscription)

---

## 📊 EXECUTIVE SUMMARY

Instead of traditional monthly subscriptions, Kovari uses a **flexible credits-based system** that allows users to only pay for what they use. This model is ideal for workflow creation tools because:

- ✅ Workflows aren't created daily (sporadic usage)
- ✅ Lower barrier to entry ($10 vs $500/month)
- ✅ Fair pricing - heavy users pay more, light users pay less
- ✅ No commitment - users can stop anytime
- ✅ Higher conversion rate (easy to try)

---

## 🎯 PRICING TIERS

### **Tier 1: Free Forever** 🆓

**Cost:** $0  
**Credits:** 0 (use features that don't require AI)  
**Includes:**
- ✅ 3 workflows (stored)
- ✅ Basic parsing (regex-based, no AI)
- ✅ Manual workflow creation
- ✅ Workflow visualization (interactive flowchart)
- ✅ Drag-and-drop reordering
- ✅ 10 pre-built templates
- ✅ Basic exports (JSON, CSV, Text, Markdown)
- ✅ Community support

**Limitations:**
- ❌ No AI parsing
- ❌ No AI analysis
- ❌ No AI chat
- ❌ No premium exports (Mermaid, Draw.io, Notion)
- ❌ Limited to 3 workflows

**Perfect for:** Individual users exploring the platform

---

### **Tier 2: Pay-Per-Use Credits** 💎 (RECOMMENDED)

**Cost:** Buy credits as needed  
**No monthly commitment**

#### **Credit Packages:**

| Package | Credits | Price | Cost per Credit | Bonus | Best For |
|---------|---------|-------|-----------------|-------|----------|
| **Starter** | 100 | $10 | $0.10 | 0% | Trying it out |
| **Popular** 🔥 | 600 | $50 | $0.083 | 20% | Regular users |
| **Best Value** ⭐ | 1,500 | $100 | $0.067 | 50% | Power users |
| **Enterprise** | 5,000 | $300 | $0.06 | 66% | Teams |

**Credits never expire!** (or 12-month expiration option)

#### **Credit Costs:**

| Feature | Credits | Why It Costs |
|---------|---------|--------------|
| **AI Parse with OpenAI** | 5 | Uses GPT-4o-mini API |
| **AI Analysis (comprehensive)** | 2 | Runs 5 AI algorithms |
| **AI Chat message** | 1 | Each message to/from AI |
| **Premium Export (Mermaid)** | 1 | Advanced formatting |
| **Premium Export (Draw.io)** | 1 | Advanced formatting |
| **Premium Export (Notion)** | 1 | Advanced formatting |
| **Save additional workflow** | 2 | Beyond free 3 workflows |

#### **Free Features (No Credits):**

- ✅ Basic parsing (regex)
- ✅ Manual workflow creation
- ✅ Viewing saved workflows
- ✅ Drag-and-drop editing
- ✅ Basic exports (JSON, CSV, Text, Markdown)
- ✅ Templates
- ✅ Interactive flowchart
- ✅ Manual gap detection (non-AI)

**Perfect for:** Most users - pay only when you need AI features

---

### **Tier 3: Pro Subscription** 🚀 (OPTIONAL)

**Cost:** $97/month  
**Credits:** Unlimited (included)  
**Best for users creating 15+ workflows/month**

**Includes Everything:**
- ✅ Unlimited AI parsing
- ✅ Unlimited AI analysis
- ✅ Unlimited AI chat
- ✅ Unlimited workflows
- ✅ All export formats
- ✅ Priority support
- ✅ API access
- ✅ Team collaboration (up to 5 users)
- ✅ Advanced analytics
- ✅ White-label option (remove Kovari branding)

**Perfect for:** Companies using it regularly, teams

---

## 📊 COMPARISON: Why Credits Beat Monthly

### **Scenario 1: Occasional User**
**Profile:** Creates 5 workflows in Month 1, then 1-2/month after

| Model | Month 1 | Month 2 | Month 3 | Total |
|-------|---------|---------|---------|-------|
| **Monthly ($500)** | $500 | $500 | $500 | **$1,500** |
| **Credits** | $50 | $10 | $10 | **$70** |

**Savings:** $1,430 (95% less!)

### **Scenario 2: Regular User**
**Profile:** Creates 10 workflows/month consistently

| Model | Month 1 | Month 2 | Month 3 | Total |
|-------|---------|---------|---------|-------|
| **Monthly ($500)** | $500 | $500 | $500 | **$1,500** |
| **Credits** | $100 | $100 | $100 | **$300** |
| **Pro Sub ($97)** | $97 | $97 | $97 | **$291** |

**Best choice:** Pro Subscription

### **Scenario 3: Enterprise User**
**Profile:** 50 workflows in Month 1 (onboarding), then 5/month

| Model | Month 1 | Month 2-12 | Total Year |
|-------|---------|------------|------------|
| **Monthly ($2,000)** | $2,000 | $22,000 | **$24,000** |
| **Credits** | $500 | $550 | **$1,050** |

**Savings:** $22,950!

---

## 💡 BUSINESS ADVANTAGES

### **For You (Kovari):**

1. **Lower Customer Acquisition Cost**
   - "Try for $10" converts better than "Subscribe for $500"
   - Free tier brings people in

2. **Higher Revenue Potential**
   - Credits model: Users who would never pay $500/month might buy $10-50 in credits
   - Capture the "occasional user" market

3. **Predictable Costs**
   - You pay OpenAI per API call
   - You charge per API call
   - Perfect cost alignment!

4. **Upsell Path**
   - Free → Credits ($10-100) → Subscription ($97)
   - Natural progression

5. **Fair Pricing**
   - Heavy users pay more (fair!)
   - Light users don't subsidize heavy users

### **For Customers:**

1. **No Commitment**
   - Buy $10 of credits to test
   - No cancellation hassles

2. **Predictable Costs**
   - See exactly what you're using
   - No surprise bills

3. **Fair Value**
   - Only pay for AI features
   - Free features stay free

---

## 🔧 TECHNICAL IMPLEMENTATION

### **Database Schema:**

```sql
-- Add to user_profiles
ALTER TABLE user_profiles ADD COLUMN credits INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN lifetime_credits_purchased INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN lifetime_credits_used INTEGER DEFAULT 0;

-- Credit transactions
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER,  -- positive = add, negative = deduct
  balance_after INTEGER,
  transaction_type TEXT, -- 'purchase', 'usage', 'bonus', 'refund'
  feature_used TEXT, -- 'ai_parse', 'ai_analysis', 'ai_chat', 'export'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Credit packages
CREATE TABLE credit_packages (
  id TEXT PRIMARY KEY,
  name TEXT,
  credits INTEGER,
  price_cents INTEGER, -- $10 = 1000 cents
  bonus_credits INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT FALSE,
  sort_order INTEGER
);

-- Insert packages
INSERT INTO credit_packages (id, name, credits, price_cents, bonus_credits, sort_order) VALUES
  ('starter', 'Starter Pack', 100, 1000, 0, 1),
  ('popular', 'Popular Pack', 500, 5000, 100, 2),
  ('value', 'Best Value', 1000, 10000, 500, 3),
  ('enterprise', 'Enterprise', 5000, 30000, 2000, 4);
```

### **Frontend Changes:**

1. **Show credit balance** in dashboard/header
2. **Credit purchase page** with Stripe integration
3. **Usage tracking** - show credits used per feature
4. **Low credit warning** - "You have 5 credits left"
5. **Feature gates** - Check credits before allowing AI features

### **Backend Functions:**

```typescript
// Check if user has enough credits
const hasEnoughCredits = async (userId: string, required: number): Promise<boolean>

// Deduct credits
const deductCredits = async (userId: string, amount: number, feature: string): Promise<boolean>

// Add credits (after purchase)
const addCredits = async (userId: string, amount: number, source: string): Promise<boolean>

// Get credit balance
const getCreditBalance = async (userId: string): Promise<number>

// Get usage history
const getCreditHistory = async (userId: string): Promise<Transaction[]>
```

---

## 💳 PAYMENT INTEGRATION (Stripe)

### **One-Time Purchases:**

```typescript
// When user clicks "Buy 100 credits for $10"
const handleBuyCredits = async (packageId: string) => {
  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',  // ONE-TIME payment, not subscription
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: '100 Credits',
          description: 'AI workflow credits'
        },
        unit_amount: 1000  // $10.00
      },
      quantity: 1
    }],
    success_url: 'https://yourapp.com/credits/success',
    cancel_url: 'https://yourapp.com/pricing'
  });
  
  // Redirect to Stripe
  window.location.href = session.url;
};
```

### **After Payment:**

```typescript
// Stripe webhook receives payment
// Add credits to user account
await addCredits(userId, 100, 'purchase');
```

---

## 📈 PRICING PSYCHOLOGY

### **Why This Works:**

1. **Anchoring Effect**
   - Show $100 package first (seems expensive)
   - Then $50 package (seems like a great deal!)
   - Then $10 package (easy entry)

2. **Bonus Incentive**
   - $10 = 100 credits (no bonus)
   - $50 = 600 credits (100 bonus = 20% more!)
   - $100 = 1,500 credits (500 bonus = 50% more!)
   - People buy bigger packages

3. **No Expiration**
   - "Credits never expire" = no pressure
   - OR "Use within 12 months" = creates urgency

4. **Free Tier**
   - Gets users hooked
   - They see value
   - Willing to pay for more

---

## 🎯 RECOMMENDED IMPLEMENTATION PLAN

### **Phase 1: Add Credits System (2-3 hours)**
- Create database tables
- Add credit balance to user profile
- Show credit balance in UI
- Add credit deduction logic

### **Phase 2: Payment Integration (3-4 hours)**
- Integrate Stripe
- Create checkout flow
- Handle webhooks
- Test purchases

### **Phase 3: Feature Gates (1-2 hours)**
- Check credits before AI features
- Show "Not enough credits" warning
- Offer to buy more credits

### **Phase 4: Analytics (1 hour)**
- Track credit usage
- Show usage reports to users
- Dashboard for you to see revenue

**Total Time:** 7-10 hours

---

## 💵 COST CALCULATION

### **Your Costs (OpenAI API):**

| Feature | Your Cost | Charge User | Profit Margin |
|---------|-----------|-------------|---------------|
| AI Parse (GPT-4o-mini) | ~$0.02 | 5 credits ($0.50) | **2,400%** 🤑 |
| AI Analysis | ~$0.01 | 2 credits ($0.20) | **1,900%** 🤑 |
| AI Chat message | ~$0.005 | 1 credit ($0.10) | **1,900%** 🤑 |

**You're making 95%+ profit on AI features!** This is VERY healthy margins.

---

## 🚀 MARKETING MESSAGES

### **Homepage:**
```
"Start Free, Pay Only When You Need AI"

✅ 3 free workflows forever
✅ Buy credits only when you need AI parsing
✅ No monthly fees, no commitment
✅ Credits never expire

Starting at just $10 for 100 credits
```

### **Pricing Page:**
```
"Flexible Pricing That Grows With You"

Free Tier → Credits → Pro Subscription

Use AI features occasionally? Buy credits as needed.
Use AI daily? Subscribe for unlimited access.
```

---

## 📋 FEATURE MATRIX

| Feature | Free Tier | Credits | Pro Sub |
|---------|-----------|---------|---------|
| **Workflows Stored** | 3 | Unlimited* | Unlimited |
| **Basic Parsing** | ✅ | ✅ | ✅ |
| **AI Parsing** | ❌ | ✅ (5 credits) | ✅ Unlimited |
| **AI Analysis** | ❌ | ✅ (2 credits) | ✅ Unlimited |
| **AI Chat** | ❌ | ✅ (1 credit/msg) | ✅ Unlimited |
| **Templates** | ✅ | ✅ | ✅ |
| **Drag & Drop** | ✅ | ✅ | ✅ |
| **Interactive Flowchart** | ✅ | ✅ | ✅ |
| **Basic Exports** | ✅ | ✅ | ✅ |
| **Premium Exports** | ❌ | ✅ (1 credit) | ✅ Unlimited |
| **Team Collaboration** | ❌ | ❌ | ✅ (5 users) |
| **API Access** | ❌ | ❌ | ✅ |
| **Support** | Community | Email | Priority |

*Saving workflows beyond 3 costs 2 credits per workflow

---

## 🎲 CREDIT PRICING STRATEGY

### **Standard Credit Costs:**

```
AI Features:
├─ AI Parse (GPT-4o-mini): 5 credits
├─ AI Analysis: 2 credits
├─ AI Chat message: 1 credit
└─ AI suggestion application: 1 credit

Storage:
├─ Save workflow (1-3): FREE
├─ Save workflow (4+): 2 credits each
└─ Delete workflow: FREE (credits not refunded)

Premium Exports:
├─ Mermaid diagram: 1 credit
├─ Draw.io XML: 1 credit
├─ Notion format: 1 credit
└─ Print view: FREE
```

### **Free Features (0 Credits):**

```
Always Free:
├─ Sign up & login
├─ Basic parsing (regex-based)
├─ Manual workflow creation
├─ View saved workflows (up to 3)
├─ Edit workflows manually
├─ Drag-and-drop reordering
├─ Browse templates
├─ Use templates
├─ Interactive flowchart
├─ Basic exports (JSON, CSV, Text, Markdown)
└─ Community support
```

---

## 💼 BUSINESS MODEL COMPARISON

### **Traditional SaaS (Monthly):**

**Pros:**
- Predictable recurring revenue
- Higher lifetime value per customer

**Cons:**
- High barrier to entry ($500/month)
- Low conversion rate
- Customer resentment when not using
- High churn rate

### **Credits System (Our Model):**

**Pros:**
- ✅ Low barrier to entry ($10)
- ✅ High conversion rate
- ✅ Fair and transparent
- ✅ Customers happy (pay for value)
- ✅ Captures occasional users
- ✅ Lower churn (no subscription to cancel)

**Cons:**
- Less predictable revenue
- Need to manage credit system
- Users might hoard credits

### **Hybrid (Best of Both):**

**Strategy:**
1. **Free tier** → Attract users
2. **Credits** → Convert occasional users
3. **Pro subscription** → Convert heavy users

**Result:** Maximum revenue from all user types!

---

## 📈 REVENUE PROJECTIONS

### **Example: 1,000 Users**

```
Free Tier (60% = 600 users):
├─ Revenue: $0
└─ Purpose: Lead generation, brand awareness

Credit Users (30% = 300 users, avg $30/month):
├─ Monthly Revenue: $9,000
└─ Annual Revenue: $108,000

Pro Subscribers (10% = 100 users, $97/month):
├─ Monthly Revenue: $9,700
└─ Annual Revenue: $116,400

TOTAL ANNUAL REVENUE: $224,400
```

### **With Traditional Monthly ($500/month):**

```
Realistic conversion: 5% = 50 users
├─ Monthly Revenue: $25,000
└─ Annual Revenue: $300,000

BUT: Much harder to get 50 paid users
Credits model gets 400 paying users easier!
```

---

## 🎯 IMPLEMENTATION ROADMAP

### **Week 1: Database & Backend**
- [ ] Create credit tables in Supabase
- [ ] Add credit balance to user profiles
- [ ] Create credit transaction functions
- [ ] Add credit packages data
- [ ] Test credit deduction logic

### **Week 2: Frontend UI**
- [ ] Add credit balance display (header/dashboard)
- [ ] Create credit purchase page
- [ ] Add "Not enough credits" warnings
- [ ] Show credit usage in analytics
- [ ] Add credit history page

### **Week 3: Payment Integration**
- [ ] Set up Stripe account
- [ ] Add Stripe checkout
- [ ] Create webhook handlers
- [ ] Test payments (Stripe test mode)
- [ ] Go live with real payments

### **Week 4: Polish & Launch**
- [ ] Update pricing page
- [ ] Add usage analytics
- [ ] Create help documentation
- [ ] Email existing users about new model
- [ ] Launch! 🚀

**Total Time:** 4 weeks (part-time) or 1-2 weeks (full-time)

---

## 🔒 SECURITY & COMPLIANCE

### **Prevent Credit Fraud:**
- ✅ Rate limiting (max 100 AI parses/day)
- ✅ Transaction logging (audit trail)
- ✅ Stripe secure payment
- ✅ Email receipts
- ✅ Refund policy (unused credits refundable within 30 days)

### **Terms:**
- Credits are non-transferable
- Credits expire in 12 months (or never - your choice)
- Refunds available for unused credits within 30 days
- Prices subject to change with 30 days notice

---

## 📞 CUSTOMER SUPPORT PLAN

### **Free Tier:**
- Community forum
- Documentation
- FAQs

### **Credit Users:**
- Email support (48-hour response)
- Access to documentation
- Video tutorials

### **Pro Subscribers:**
- Priority email support (24-hour response)
- Live chat
- Onboarding call
- Dedicated account manager (Enterprise)

---

## 🎁 PROMOTIONAL IDEAS

### **Launch Promotions:**
1. **First 100 users:** 50 bonus credits
2. **Referral program:** 25 credits for each referral
3. **Bundle deals:** Buy $100 credits, get $125 worth
4. **Seasonal sales:** Black Friday - 100% bonus credits

### **Retention:**
1. **Monthly free credits:** Give 5 free credits/month to keep users engaged
2. **Loyalty program:** Buy 5 times, get 10% discount
3. **Enterprise deals:** Custom pricing for >10,000 credits

---

## 📊 KEY METRICS TO TRACK

### **User Metrics:**
- Free tier users
- Credit purchasers
- Pro subscribers
- Conversion rate (Free → Paid)
- Average credits purchased
- Credit usage patterns

### **Revenue Metrics:**
- Monthly Recurring Revenue (MRR) from Pro subs
- Credit sales revenue
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (LTV)
- Cost of Goods Sold (OpenAI API costs)

### **Usage Metrics:**
- Credits used per feature
- Most popular features
- Peak usage times
- Workflows created per user

---

## 🏆 SUCCESS CRITERIA

**Month 1:**
- 100 free tier signups
- 20 credit purchases
- 2 Pro subscriptions

**Month 3:**
- 500 free tier users
- 100 credit purchasers
- 10 Pro subscriptions
- $2,000 MRR

**Month 6:**
- 1,000 free tier users
- 300 credit purchasers
- 30 Pro subscriptions
- $10,000 MRR

**Month 12:**
- 3,000 free tier users
- 1,000 credit purchasers
- 100 Pro subscriptions
- $30,000 MRR

---

## ✅ NEXT STEPS

1. **Review this model** - Does it fit your business goals?
2. **Decide on credit costs** - Adjust pricing as needed
3. **Choose expiration policy** - Never expire vs 12 months
4. **Set up Stripe** - Payment processing
5. **Implement credits system** - Database + frontend
6. **Launch** - Start accepting payments!

---

## 📝 NOTES

- This model is highly flexible - adjust credit costs based on actual OpenAI API usage
- Consider offering **refills** - "Auto-buy 100 credits when balance < 10"
- Track metrics closely first 3 months to optimize pricing
- A/B test different credit package sizes and bonuses

---

**Want me to start implementing the credits system now?** 🚀

I can:
1. Create the database migration
2. Add credit balance display
3. Integrate Stripe checkout
4. Add credit gates to AI features
5. Update the Pricing page

Let me know and I'll build it! 💎

