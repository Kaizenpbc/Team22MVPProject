-- Populate user_profiles table with data from auth.users
-- This ensures all auth users have corresponding profiles

-- First, let's see what we're working with
DO $$
DECLARE
    auth_count INTEGER;
    profile_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO auth_count FROM auth.users;
    SELECT COUNT(*) INTO profile_count FROM public.user_profiles;
    
    RAISE NOTICE 'Auth users: %, User profiles: %', auth_count, profile_count;
END $$;

-- Insert profiles for ALL auth users (even if they already exist)
INSERT INTO public.user_profiles (
    id, 
    subscription_status, 
    subscription_tier,
    sop_access, 
    demo_completed,
    workflow_limit,
    user_limit,
    username,
    role,
    avatar_url,
    created_at,
    updated_at
)
SELECT 
    au.id,
    'active',      -- Active status
    'free',        -- Free tier (auto-granted)
    TRUE,          -- SOP access granted
    FALSE,         -- Demo not completed yet
    3,             -- 3 workflows limit
    1,             -- 1 user limit
    LOWER(SPLIT_PART(au.email, '@', 1)), -- Generate username from email
    CASE 
        WHEN au.email LIKE '%admin%' OR au.email LIKE '%@kpbc.ca' THEN 'admin'
        ELSE 'user'
    END,           -- Set role based on email
    NULL,          -- No avatar initially
    au.created_at, -- Use their original signup date
    NOW()          -- Updated now
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    role = EXCLUDED.role,
    subscription_status = EXCLUDED.subscription_status,
    subscription_tier = EXCLUDED.subscription_tier,
    sop_access = EXCLUDED.sop_access,
    workflow_limit = EXCLUDED.workflow_limit,
    user_limit = EXCLUDED.user_limit,
    updated_at = NOW();

-- Show final count
DO $$
DECLARE
    final_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO final_count FROM public.user_profiles;
    RAISE NOTICE 'Final user profiles count: %', final_count;
END $$;
