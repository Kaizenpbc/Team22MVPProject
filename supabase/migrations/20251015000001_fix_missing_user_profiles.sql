-- Fix missing user profiles for existing auth users
-- Creates profiles for users who can sign in but don't have a profile yet

-- Insert profiles for any auth users that are missing them
INSERT INTO public.user_profiles (
  id, 
  subscription_status, 
  subscription_tier,
  sop_access, 
  demo_completed,
  workflow_limit,
  user_limit,
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
  au.created_at, -- Use their original signup date
  NOW()
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL  -- Only for users without profiles
ON CONFLICT (id) DO NOTHING;  -- Skip if profile exists

-- Log success
DO $$
DECLARE
  fixed_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO fixed_count
  FROM auth.users au
  INNER JOIN public.user_profiles up ON au.id = up.id;
  
  RAISE NOTICE 'Successfully created missing profiles. Total users with profiles: %', fixed_count;
END $$;

