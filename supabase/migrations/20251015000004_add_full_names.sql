-- Add full_name column to user_profiles and populate it
-- This stores the first and last names from auth.users

-- Add full_name column if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Update existing profiles with full names from auth.users
UPDATE public.user_profiles 
SET full_name = au.raw_user_meta_data->>'full_name'
FROM auth.users au
WHERE public.user_profiles.id = au.id
AND au.raw_user_meta_data->>'full_name' IS NOT NULL;

-- Update the handle_new_user function to include full_name
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
        user_limit,
        username,
        role,
        avatar_url,
        full_name
    )
    VALUES (
        NEW.id, 
        'active',      -- Active by default
        'free',        -- Free tier
        TRUE,          -- SOP access granted
        FALSE,         -- Demo not completed yet
        3,             -- 3 workflows
        1,             -- 1 user
        LOWER(SPLIT_PART(NEW.email, '@', 1)), -- Generate username from email
        CASE 
            WHEN NEW.email LIKE '%admin%' OR NEW.email LIKE '%@kpbc.ca' THEN 'admin'
            ELSE 'user'
        END,           -- Set role based on email
        NULL,          -- No avatar initially
        NEW.raw_user_meta_data->>'full_name' -- Full name from signup
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the get_user_access_status function to include full_name
DROP FUNCTION IF EXISTS public.get_user_access_status(UUID);

CREATE OR REPLACE FUNCTION public.get_user_access_status(p_user_id UUID)
RETURNS TABLE (
    user_id UUID,
    subscription_status VARCHAR,
    subscription_tier VARCHAR,
    sop_access BOOLEAN,
    demo_completed BOOLEAN,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    workflow_limit INTEGER,
    user_limit INTEGER,
    username VARCHAR,
    role VARCHAR,
    avatar_url TEXT,
    full_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id AS user_id,
        COALESCE(up.subscription_status, 'none')::VARCHAR,
        up.subscription_tier::VARCHAR,
        COALESCE(up.sop_access, FALSE),
        COALESCE(up.demo_completed, FALSE),
        up.subscription_expires_at,
        up.workflow_limit,
        up.user_limit,
        up.username,
        up.role,
        up.avatar_url,
        up.full_name
    FROM public.user_profiles up
    WHERE up.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON COLUMN public.user_profiles.full_name IS 'User full name (first and last name)';

-- Show count of profiles with full names
DO $$
DECLARE
    total_profiles INTEGER;
    profiles_with_names INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_profiles FROM public.user_profiles;
    SELECT COUNT(*) INTO profiles_with_names FROM public.user_profiles WHERE full_name IS NOT NULL;
    
    RAISE NOTICE 'Total profiles: %, Profiles with full names: %', total_profiles, profiles_with_names;
END $$;
