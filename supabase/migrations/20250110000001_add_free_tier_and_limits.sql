-- Migration: Add Free Tier and Workflow/User Limits
-- This migration adds support for the freemium model

-- Step 1: Add workflow_limit and user_limit columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS workflow_limit INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS user_limit INTEGER DEFAULT 1;

-- Step 2: Update subscription_tier constraint to include 'free'
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_subscription_tier_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise'));

-- Step 3: Update user_subscriptions tier constraint to include 'free'
ALTER TABLE public.user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_tier_check;

ALTER TABLE public.user_subscriptions 
ADD CONSTRAINT user_subscriptions_tier_check 
CHECK (tier IN ('free', 'starter', 'professional', 'enterprise'));

-- Step 4: Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON public.user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_workflow_limit ON public.user_profiles(workflow_limit);

-- Step 5: Update existing users to have free tier if they have no subscription
UPDATE public.user_profiles
SET 
    subscription_tier = 'free',
    subscription_status = 'active',
    sop_access = TRUE,
    workflow_limit = 3,
    user_limit = 1
WHERE subscription_tier IS NULL 
   OR subscription_status = 'none';

-- Step 6: Set limits for existing paid tiers
UPDATE public.user_profiles
SET 
    workflow_limit = CASE 
        WHEN subscription_tier = 'starter' THEN 50
        WHEN subscription_tier = 'professional' THEN -1  -- -1 means unlimited
        WHEN subscription_tier = 'enterprise' THEN -1
        ELSE 3
    END,
    user_limit = CASE 
        WHEN subscription_tier = 'starter' THEN 5
        WHEN subscription_tier = 'professional' THEN 25
        WHEN subscription_tier = 'enterprise' THEN -1
        ELSE 1
    END
WHERE subscription_tier IN ('starter', 'professional', 'enterprise');

-- Step 7: Update the handle_new_user function to create FREE tier profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-grant FREE tier to all new users
    INSERT INTO public.user_profiles (
        id, 
        subscription_status, 
        subscription_tier,
        sop_access, 
        demo_completed,
        workflow_limit,
        user_limit
    )
    VALUES (
        NEW.id, 
        'active',      -- Active by default
        'free',        -- Free tier
        TRUE,          -- SOP access granted
        FALSE,         -- Demo not completed yet
        3,             -- 3 workflows
        1              -- 1 user
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Update get_user_access_status RPC function to return new fields
CREATE OR REPLACE FUNCTION public.get_user_access_status(p_user_id UUID)
RETURNS TABLE (
    user_id UUID,
    subscription_status VARCHAR,
    subscription_tier VARCHAR,
    sop_access BOOLEAN,
    demo_completed BOOLEAN,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    workflow_limit INTEGER,
    user_limit INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id AS user_id,
        COALESCE(up.subscription_status, 'active') AS subscription_status,
        COALESCE(up.subscription_tier, 'free') AS subscription_tier,
        COALESCE(up.sop_access, TRUE) AS sop_access,
        COALESCE(up.demo_completed, FALSE) AS demo_completed,
        up.subscription_expires_at,
        COALESCE(up.workflow_limit, 3) AS workflow_limit,
        COALESCE(up.user_limit, 1) AS user_limit
    FROM public.user_profiles up
    WHERE up.id = p_user_id;
    
    -- If no profile exists, return free tier defaults
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            p_user_id AS user_id,
            'active'::VARCHAR AS subscription_status,
            'free'::VARCHAR AS subscription_tier,
            TRUE AS sop_access,
            FALSE AS demo_completed,
            NULL::TIMESTAMP WITH TIME ZONE AS subscription_expires_at,
            3 AS workflow_limit,
            1 AS user_limit;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Update the trigger function that updates profiles when subscriptions change
CREATE OR REPLACE FUNCTION public.update_user_profile_from_subscription()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user profile based on subscription changes
    UPDATE public.user_profiles
    SET 
        subscription_status = NEW.status,
        subscription_tier = NEW.tier,
        sop_access = CASE 
            WHEN NEW.status = 'active' THEN TRUE
            ELSE FALSE
        END,
        workflow_limit = CASE 
            WHEN NEW.tier = 'free' THEN 3
            WHEN NEW.tier = 'starter' THEN 50
            WHEN NEW.tier = 'professional' THEN -1
            WHEN NEW.tier = 'enterprise' THEN -1
            ELSE 3
        END,
        user_limit = CASE 
            WHEN NEW.tier = 'free' THEN 1
            WHEN NEW.tier = 'starter' THEN 5
            WHEN NEW.tier = 'professional' THEN 25
            WHEN NEW.tier = 'enterprise' THEN -1
            ELSE 1
        END,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_subscription_change ON public.user_subscriptions;
CREATE TRIGGER on_subscription_change
    AFTER INSERT OR UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_profile_from_subscription();

-- Step 10: Create helper function to check workflow limit
CREATE OR REPLACE FUNCTION public.check_workflow_limit(p_user_id UUID, p_current_count INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    v_limit INTEGER;
BEGIN
    SELECT workflow_limit INTO v_limit
    FROM public.user_profiles
    WHERE id = p_user_id;
    
    -- -1 means unlimited
    IF v_limit = -1 THEN
        RETURN TRUE;
    END IF;
    
    -- Check if under limit
    RETURN p_current_count < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Add helpful comment
COMMENT ON TABLE public.user_profiles IS 'User subscription profiles with freemium support. Free tier gets 3 workflows, 1 user.';
COMMENT ON COLUMN public.user_profiles.workflow_limit IS 'Number of workflows allowed. -1 = unlimited, 3 = free tier default';
COMMENT ON COLUMN public.user_profiles.user_limit IS 'Number of team members allowed. -1 = unlimited, 1 = free tier default';
COMMENT ON FUNCTION public.get_user_access_status IS 'Returns user access status including workflow and user limits';
COMMENT ON FUNCTION public.check_workflow_limit IS 'Helper to check if user can create more workflows';

