# 💳 Stripe Integration Setup Guide

**Last Updated:** October 13, 2025  
**Purpose:** Enable credit purchases via Stripe payment processing

---

## 📋 PREREQUISITES

1. ✅ Credits system database (already created)
2. ✅ Credits service (already implemented)
3. ✅ Stripe npm package (already installed)
4. ⏸️ Stripe account (you need to create)

---

## 🚀 STEP 1: Create Stripe Account (5 minutes)

1. Go to [stripe.com](https://stripe.com)
2. Click **"Start now"**
3. Sign up with your email
4. Complete verification (may take 24-48 hours for full approval)
5. **You can use TEST MODE immediately** (no verification needed!)

---

## 🔑 STEP 2: Get API Keys (2 minutes)

### **Test Mode (for development):**

1. In Stripe Dashboard, toggle **"Test mode"** ON (top right)
2. Go to **Developers → API keys**
3. Copy these TWO keys:
   - **Publishable key:** `pk_test_...` (safe to expose in frontend)
   - **Secret key:** `sk_test_...` (NEVER expose! Backend only)

### **Live Mode (for production):**

1. Toggle **"Test mode"** OFF
2. Get the LIVE keys:
   - **Publishable key:** `pk_live_...`
   - **Secret key:** `sk_live_...`

---

## 📝 STEP 3: Add Keys to .env

Add to your `.env` file:

```env
# Stripe Keys (TEST MODE - for development)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# Stripe Secret (for backend/webhooks)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

**⚠️ NEVER commit .env to git!** (already in .gitignore)

---

## 🔧 STEP 4: Create Stripe Products & Prices

### **Option A: Via Stripe Dashboard (Easiest)**

1. Go to **Products → Add Product**
2. Create 4 products:

**Product 1: Starter Pack**
- Name: Starter Pack - 100 Credits
- Price: $10.00 USD
- One-time payment
- Product ID: Save this! (e.g., `prod_abc123`)

**Product 2: Popular Pack**
- Name: Popular Pack - 600 Credits (500 + 100 bonus)
- Price: $50.00 USD
- One-time payment

**Product 3: Best Value Pack**
- Name: Best Value - 1,500 Credits (1000 + 500 bonus)
- Price: $100.00 USD
- One-time payment

**Product 4: Enterprise Pack**
- Name: Enterprise - 7,000 Credits (5000 + 2000 bonus)
- Price: $300.00 USD
- One-time payment

3. Copy the **Price IDs** (e.g., `price_abc123`) for each

---

### **Option B: Via API (Programmatic)**

Run this once to create products:

```javascript
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');

// Create products
const products = [
  { name: 'Starter Pack - 100 Credits', price: 1000, credits: 100 },
  { name: 'Popular Pack - 600 Credits', price: 5000, credits: 600 },
  { name: 'Best Value - 1,500 Credits', price: 10000, credits: 1500 },
  { name: 'Enterprise - 7,000 Credits', price: 30000, credits: 7000 }
];

for (const product of products) {
  const prod = await stripe.products.create({
    name: product.name,
    metadata: { credits: product.credits }
  });
  
  const price = await stripe.prices.create({
    product: prod.id,
    unit_amount: product.price,
    currency: 'usd',
  });
  
  console.log(`Product: ${product.name}, Price ID: ${price.id}`);
}
```

---

## 🖥️ STEP 5: Create Supabase Edge Function for Checkout

Create `supabase/functions/create-stripe-checkout/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.6.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  try {
    const { packageId, userId, userEmail, credits, priceCents, successUrl, cancelUrl } = await req.json();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} Workflow Credits`,
              description: `Credits for AI-powered workflow features`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        packageId,
        credits: credits.toString(),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 🪝 STEP 6: Create Stripe Webhook Handler

Create `supabase/functions/stripe-webhook/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.6.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or secret', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, credits } = session.metadata || {};

      if (userId && credits) {
        // Add credits to user account
        await supabase.rpc('add_credits', {
          p_user_id: userId,
          p_amount: parseInt(credits),
          p_transaction_type: 'purchase',
          p_metadata: { stripe_session_id: session.id }
        });

        console.log(`✅ Added ${credits} credits to user ${userId}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 🚀 STEP 7: Deploy Edge Functions

```bash
# Set Stripe secret
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_KEY

# Deploy functions
supabase functions deploy create-stripe-checkout
supabase functions deploy stripe-webhook
```

---

## 🔗 STEP 8: Configure Stripe Webhook

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
4. Events to send: Select `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Run: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET`

---

## ✅ STEP 9: Test the Integration

### **Test Mode (FREE - No Real Money):**

1. Use test keys in `.env`
2. Buy credits in your app
3. Use Stripe test card: `4242 4242 4242 4242`
4. Expiry: Any future date (e.g., 12/34)
5. CVC: Any 3 digits (e.g., 123)
6. ZIP: Any 5 digits (e.g., 12345)

**Test cards:**
- ✅ Success: `4242 4242 4242 4242`
- ❌ Decline: `4000 0000 0000 0002`
- 🔄 3D Secure: `4000 0025 0000 3155`

---

## 🎯 CURRENT STATUS

**✅ Completed:**
- Database schema for credits
- Credit service functions
- Credits purchase page UI
- Credit balance display in header
- Credit gates on AI features
- Stripe package installed

**⏸️ Pending (Need to set up):**
- Stripe account
- API keys
- Edge functions
- Webhook configuration

---

## 📝 QUICK START (Test Mode)

**To enable payments TODAY in test mode:**

1. Sign up for Stripe (5 min)
2. Get TEST API keys (2 min)
3. Add to `.env`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   ```
4. Restart server
5. Try buying credits with test card!

---

## 💰 COST CALCULATION (For That Hospital Workflow)

**User's perspective:**

```
Hospital discharge workflow:
- Paste unstructured text
- Click "Parse with AI" (costs 5 credits = $0.50)
- AI extracts 12-15 structured steps
- Detects gaps and suggests missing steps
- Creates interactive flowchart
- Export to Draw.io/Mermaid/Notion

TOTAL: 5 credits ($0.50)

If they also click "Analytics":
- +2 credits ($0.20)

TOTAL WITH ANALYTICS: 7 credits ($0.70)
```

**Your perspective:**

```
OpenAI API cost for that workflow:
- Parse: ~$0.0002
- Analysis: ~$0.0002

TOTAL COST: $0.0004
REVENUE: $0.70
PROFIT: $0.6996 (99.94% margin!) 🤑
```

---

## 🎁 BONUS: Give Users Free Credits

To get people started, give them FREE credits when they sign up:

```sql
-- Give 10 free credits to all new users
UPDATE user_profiles 
SET credits = credits + 10
WHERE credits < 10;
```

This lets them:
- Try 2 AI parses (5 credits each)
- OR 1 AI parse (5) + 5 AI chat messages (1 each)

Gets them hooked! 🎣

---

## 📞 SUPPORT

**Common Issues:**

**"Stripe key not found"**
- Add VITE_STRIPE_PUBLISHABLE_KEY to .env
- Restart dev server

**"Checkout failed"**
- Check Stripe test mode is ON
- Verify keys are correct
- Check browser console for errors

**"Credits not added after payment"**
- Check webhook is configured
- Check webhook secret is set
- View Stripe webhook logs

---

## 🎯 NEXT STEPS

1. **Create Stripe account** (if you haven't)
2. **Add test keys to .env**
3. **Restart server**
4. **Test with test card**
5. **Deploy edge functions** (when ready for production)
6. **Switch to live mode** (when ready to accept real money!)

---

**Need help? The Stripe documentation is excellent: https://stripe.com/docs**

**Ready to go live? Just swap test keys for live keys!** 🚀

