# 💰 Kovari Pricing Model - Bring Your Own API Key

**Last Updated:** January 15, 2025  
**Model Type:** Simple Platform Fee + User's Own OpenAI API Key

---

## 📊 EXECUTIVE SUMMARY

Kovari uses a **simple platform fee model** where users bring their own OpenAI API key. This approach is ideal for workflow creation tools because:

- ✅ **Zero AI costs for Kovari** - users pay OpenAI directly
- ✅ **Transparent pricing** - no markup on AI usage
- ✅ **Simple business model** - just platform access fees
- ✅ **Competitive advantage** - cheaper than competitors who markup AI
- ✅ **User control** - they manage their own AI usage and costs

---

## 🎯 PRICING TIERS

### **Tier 1: Free Forever** 🆓

**Cost:** $0  
**OpenAI API Key:** Not required  
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

### **Tier 2: Pro** 💎

**Cost:** $19/month  
**OpenAI API Key:** Required (user provides their own)  
**Best for users creating 5+ workflows/month**

**Includes Everything:**
- ✅ Unlimited workflows
- ✅ AI parsing (uses your OpenAI API key)
- ✅ AI analysis (comprehensive gap detection)
- ✅ AI chat (workflow assistance)
- ✅ All export formats (Mermaid, Draw.io, Notion)
- ✅ Interactive flowchart with decision nodes
- ✅ Advanced workflow analytics
- ✅ Priority email support
- ✅ API access
- ✅ Workflow templates library

**AI Costs (Paid Directly to OpenAI):**
- AI Parse: ~$0.02 per workflow
- AI Analysis: ~$0.01 per analysis
- AI Chat: ~$0.005 per message

**Perfect for:** Regular users who want AI features without markup

---

### **Tier 3: Enterprise** 🚀

**Cost:** $49/month  
**OpenAI API Key:** Required (user provides their own)  
**Best for teams and organizations**

**Includes Everything in Pro, Plus:**
- ✅ Team collaboration (up to 10 users)
- ✅ Shared workflow library
- ✅ Advanced analytics dashboard
- ✅ White-label option (remove Kovari branding)
- ✅ Custom integrations (API webhooks)
- ✅ Priority phone support
- ✅ Dedicated account manager
- ✅ Custom onboarding
- ✅ SLA guarantees

**AI Costs (Paid Directly to OpenAI):**
- Same as Pro tier - users pay OpenAI directly

**Perfect for:** Teams, agencies, and organizations

---

## 📊 COMPARISON: Why BYOK (Bring Your Own Key) Beats Competitors

### **Scenario 1: Occasional User**
**Profile:** Creates 5 workflows in Month 1, then 1-2/month after

| Model | Month 1 | Month 2 | Month 3 | Total |
|-------|---------|---------|---------|-------|
| **Competitor ($500/month)** | $500 | $500 | $500 | **$1,500** |
| **Kovari Pro ($19/month)** | $19 + $0.10 AI | $19 + $0.02 AI | $19 + $0.02 AI | **$57.14** |

**Savings:** $1,442.86 (96% less!)

### **Scenario 2: Regular User**
**Profile:** Creates 10 workflows/month consistently

| Model | Month 1 | Month 2 | Month 3 | Total |
|-------|---------|---------|---------|-------|
| **Competitor ($500/month)** | $500 | $500 | $500 | **$1,500** |
| **Kovari Pro ($19/month)** | $19 + $0.20 AI | $19 + $0.20 AI | $19 + $0.20 AI | **$57.60** |

**Savings:** $1,442.40 (96% less!)

### **Scenario 3: Enterprise Team**
**Profile:** 5 team members, 20 workflows/month total

| Model | Month 1 | Month 2-12 | Total Year |
|-------|---------|------------|------------|
| **Competitor ($2,000/month)** | $2,000 | $22,000 | **$24,000** |
| **Kovari Enterprise ($49/month)** | $49 + $0.40 AI | $588 + $4.80 AI | **$642.20** |

**Savings:** $23,357.80!

---

## 💡 BUSINESS ADVANTAGES

### **For You (Kovari):**

1. **Zero AI Costs**
   - No OpenAI bills on your end
   - Users pay OpenAI directly
   - Predictable platform costs only

2. **Simple Business Model**
   - Just monthly platform fees
   - No complex credit management
   - No payment processing for AI usage

3. **Competitive Advantage**
   - 96% cheaper than competitors
   - Transparent pricing (no AI markup)
   - Users control their AI costs

4. **Higher Conversion**
   - $19/month vs $500/month
   - "Bring your own API key" is appealing
   - No commitment to expensive AI usage

5. **Scalable Revenue**
   - Platform fees scale with users
   - No per-usage costs to manage
   - Clear profit margins

### **For Customers:**

1. **Transparent Costs**
   - See exactly what OpenAI charges
   - No hidden AI markups
   - Pay only for platform access

2. **Control AI Usage**
   - Manage their own OpenAI spending
   - Set their own usage limits
   - No surprise AI bills

3. **Better Value**
   - 96% savings vs competitors
   - Keep their existing OpenAI relationship
   - Simple monthly platform fee

4. **No Commitment**
   - Cancel anytime (just platform fee)
   - Keep their OpenAI API key
   - No vendor lock-in

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

