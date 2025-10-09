# Apply Free Tier Migration

## 🎯 What This Migration Does

This migration adds **Freemium Model** support to your Team22MVP project:

- ✅ Adds `workflow_limit` and `user_limit` columns
- ✅ Updates subscription tiers to include `'free'`
- ✅ Auto-grants FREE tier to all new signups
- ✅ Updates existing users to FREE tier if they have no subscription
- ✅ Sets proper limits for each tier:
  - **Free**: 3 workflows, 1 user
  - **Starter**: 50 workflows, 5 users
  - **Professional**: Unlimited workflows, 25 users
  - **Enterprise**: Unlimited everything

## 📋 Prerequisites

1. Supabase CLI installed (`npm install -g supabase`)
2. Supabase project linked (`supabase link --project-ref YOUR_PROJECT_ID`)
3. Database credentials ready

## 🚀 How to Apply

### Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you're in the project root
cd C:\Users\gerog\Documents\Team22MVPProject

# Apply the migration
supabase db push

# Or apply just this migration
supabase migration up 20250110000001_add_free_tier_and_limits
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the sidebar
3. Click **+ New Query**
4. Copy and paste the entire contents of:
   `supabase/migrations/20250110000001_add_free_tier_and_limits.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Verify success message appears

### Option 3: Manual SQL Execution

1. Connect to your Supabase database
2. Run the migration SQL file:
   ```sql
   -- Copy and paste the entire migration file
   ```

## ✅ Verify Migration Success

Run this query in SQL Editor to verify:

```sql
-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('workflow_limit', 'user_limit');

-- Check if free tier exists
SELECT subscription_tier, COUNT(*) 
FROM user_profiles 
GROUP BY subscription_tier;

-- Test the RPC function
SELECT * FROM get_user_access_status('YOUR_USER_ID_HERE');
```

Expected results:
- ✅ Both columns exist (workflow_limit, user_limit)
- ✅ Users show 'free' tier
- ✅ RPC returns workflow_limit and user_limit fields

## 🔄 What Happens to Existing Data

### New Users (After Migration)
- Automatically get FREE tier
- `subscription_status`: 'active'
- `subscription_tier`: 'free'
- `sop_access`: TRUE
- `workflow_limit`: 3
- `user_limit`: 1

### Existing Users (Updated by Migration)
- Users with no subscription → FREE tier (3 workflows, 1 user)
- Users with 'starter' → 50 workflows, 5 users
- Users with 'professional' → Unlimited workflows (-1), 25 users
- Users with 'enterprise' → Unlimited everything (-1)

### Database Changes
- ✅ `user_profiles.workflow_limit` column added
- ✅ `user_profiles.user_limit` column added
- ✅ Tier constraints updated to include 'free'
- ✅ RPC function returns new fields
- ✅ Trigger auto-grants free tier to new signups

## 🛠️ Rollback (If Needed)

If you need to rollback this migration:

```sql
-- Remove new columns
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS workflow_limit,
DROP COLUMN IF EXISTS user_limit;

-- Restore old tier constraint
ALTER TABLE public.user_profiles 
DROP CONSTRAINT user_profiles_subscription_tier_check,
ADD CONSTRAINT user_profiles_subscription_tier_check 
CHECK (subscription_tier IN ('starter', 'professional', 'enterprise'));

-- Drop new functions
DROP FUNCTION IF EXISTS public.check_workflow_limit(UUID, INTEGER);

-- Restore old RPC function (run the old version)
```

## 📞 Support

If you encounter issues:
1. Check Supabase logs for errors
2. Verify your database connection
3. Ensure you have the latest Supabase CLI
4. Check that RLS policies allow the operations

## 🎉 Post-Migration Testing

1. Sign up a new user → Should get FREE tier automatically
2. Check Dashboard → Should show "3 workflows" limit
3. Access SOP → URL should include `tier=free&workflow_limit=3`
4. View Pricing → Should see FREE tier card

---

**Migration File**: `20250110000001_add_free_tier_and_limits.sql`  
**Created**: January 10, 2025  
**Status**: ✅ Ready to apply

